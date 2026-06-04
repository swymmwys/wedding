import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSETS_DIR: string = path.resolve("src/assets");
const SOURCE_DIR: string = path.resolve("src");
const IMAGE_EXTENSIONS: Set<string> = new Set([".png", ".jpg", ".jpeg"]);
const CODE_EXTENSIONS: Set<string> = new Set([".vue", ".ts", ".tsx", ".js", ".jsx", ".json"]);

type OptimizationSummary = {
  scannedFiles: number;
  optimizedFiles: number;
  convertedPngToWebp: number;
  updatedSourceFiles: number;
  savedBytes: number;
};

type ConvertedAsset = {
  from: string;
  to: string;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const collectFiles = async (
  directory: string,
  shouldInclude: (filePath: string) => boolean,
): Promise<string[]> => {
  const entries: Array<string> = await readdir(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath: string = path.join(directory, entry);
    const entryStats = await stat(entryPath);

    if (entryStats.isDirectory()) {
      const nestedFiles: string[] = await collectFiles(entryPath, shouldInclude);
      files.push(...nestedFiles);
      continue;
    }

    if (!entryStats.isFile() || !shouldInclude(entryPath)) {
      continue;
    }
    files.push(entryPath);
  }

  return files;
};

const optimizeFile = async (
  filePath: string,
): Promise<{ savedBytes: number; convertedAsset?: ConvertedAsset }> => {
  const extension: string = path.extname(filePath).toLowerCase();
  const originalSize: number = (await stat(filePath)).size;
  const pipeline = sharp(filePath, { failOn: "none" }).rotate();

  if (extension === ".png") {
    const webpBuffer: Buffer = await pipeline
      .webp({
        quality: 82,
        alphaQuality: 90,
        effort: 4,
      })
      .toBuffer();
    const webpSize: number = webpBuffer.byteLength;
    const deltaBytes: number = originalSize - webpSize;

    if (deltaBytes <= 0) {
      return { savedBytes: 0 };
    }

    const webpPath: string = filePath.replace(/\.png$/i, ".webp");
    await writeFile(webpPath, webpBuffer);
    await rm(filePath);
    return {
      savedBytes: deltaBytes,
      convertedAsset: {
        from: filePath,
        to: webpPath,
      },
    };
  }

  if (!IMAGE_EXTENSIONS.has(extension)) {
    return { savedBytes: 0 };
  }

  const optimizedBuffer: Buffer = await pipeline
    .jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true,
    })
    .toBuffer();
  const optimizedSize: number = optimizedBuffer.byteLength;
  const deltaBytes: number = originalSize - optimizedSize;

  if (deltaBytes <= 0) {
    return { savedBytes: 0 };
  }

  await writeFile(filePath, optimizedBuffer);
  return { savedBytes: deltaBytes };
};

const updateAssetReferences = async (convertedAssets: ConvertedAsset[]): Promise<number> => {
  if (convertedAssets.length === 0) {
    return 0;
  }

  const sourceFiles: string[] = await collectFiles(
    SOURCE_DIR,
    (filePath: string): boolean => CODE_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
  const replacementMap: Map<string, string> = new Map(
    convertedAssets.map((asset: ConvertedAsset): [string, string] => [
      path.relative(ASSETS_DIR, asset.from).split(path.sep).join("/"),
      path.relative(ASSETS_DIR, asset.to).split(path.sep).join("/"),
    ]),
  );
  let changedFileCount: number = 0;

  for (const filePath of sourceFiles) {
    const originalContent: string = await readFile(filePath, "utf8");
    let nextContent: string = originalContent;

    for (const [fromRelativePath, toRelativePath] of replacementMap.entries()) {
      const fromAssetPath: string = `@/assets/${fromRelativePath}`;
      const toAssetPath: string = `@/assets/${toRelativePath}`;
      if (nextContent.includes(fromAssetPath)) {
        nextContent = nextContent.split(fromAssetPath).join(toAssetPath);
      }
    }

    if (nextContent !== originalContent) {
      await writeFile(filePath, nextContent, "utf8");
      changedFileCount += 1;
    }
  }

  return changedFileCount;
};

const run = async (): Promise<void> => {
  const imageFiles: string[] = await collectFiles(
    ASSETS_DIR,
    (filePath: string): boolean => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
  const summary: OptimizationSummary = {
    scannedFiles: imageFiles.length,
    optimizedFiles: 0,
    convertedPngToWebp: 0,
    updatedSourceFiles: 0,
    savedBytes: 0,
  };
  const convertedAssets: ConvertedAsset[] = [];

  for (const filePath of imageFiles) {
    const result = await optimizeFile(filePath);
    const { savedBytes } = result;
    if (savedBytes > 0) {
      summary.optimizedFiles += 1;
      summary.savedBytes += savedBytes;
      console.log(
        `optimized ${path.relative(process.cwd(), filePath)} (-${formatBytes(savedBytes)})`,
      );
    }

    if (result.convertedAsset) {
      convertedAssets.push(result.convertedAsset);
      summary.convertedPngToWebp += 1;
      console.log(
        `converted ${path.relative(process.cwd(), result.convertedAsset.from)} -> ${path.relative(process.cwd(), result.convertedAsset.to)}`,
      );
    }
  }

  summary.updatedSourceFiles = await updateAssetReferences(convertedAssets);

  console.log(
    [
      `Done.`,
      `Scanned: ${summary.scannedFiles}`,
      `Optimized: ${summary.optimizedFiles}`,
      `PNG->WebP: ${summary.convertedPngToWebp}`,
      `Updated source files: ${summary.updatedSourceFiles}`,
      `Saved: ${formatBytes(summary.savedBytes)}`,
    ].join(" "),
  );
};

run().catch((error: unknown) => {
  const message: string = error instanceof Error ? error.message : String(error);
  console.error(`Asset optimization failed: ${message}`);
  process.exitCode = 1;
});
