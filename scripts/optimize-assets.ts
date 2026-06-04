import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSETS_DIR: string = path.resolve("src/assets");
const SUPPORTED_EXTENSIONS: Set<string> = new Set([".png", ".jpg", ".jpeg"]);

type OptimizationSummary = {
  scannedFiles: number;
  optimizedFiles: number;
  savedBytes: number;
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

const collectImageFiles = async (directory: string): Promise<string[]> => {
  const entries: Array<string> = await readdir(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath: string = path.join(directory, entry);
    const entryStats = await stat(entryPath);

    if (entryStats.isDirectory()) {
      const nestedFiles: string[] = await collectImageFiles(entryPath);
      files.push(...nestedFiles);
      continue;
    }

    if (!entryStats.isFile()) {
      continue;
    }

    const extension: string = path.extname(entry).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(extension)) {
      files.push(entryPath);
    }
  }

  return files;
};

const optimizeFile = async (filePath: string): Promise<number> => {
  const extension: string = path.extname(filePath).toLowerCase();
  const originalSize: number = (await stat(filePath)).size;
  const pipeline = sharp(filePath, { failOn: "none" }).rotate();

  let optimizedBuffer: Buffer;
  if (extension === ".png") {
    optimizedBuffer = await pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 85,
      })
      .toBuffer();
  } else {
    optimizedBuffer = await pipeline
      .jpeg({
        quality: 82,
        mozjpeg: true,
      })
      .toBuffer();
  }

  const optimizedSize: number = optimizedBuffer.byteLength;
  const deltaBytes: number = originalSize - optimizedSize;

  if (deltaBytes <= 0) {
    return 0;
  }

  await writeFile(filePath, optimizedBuffer);
  return deltaBytes;
};

const run = async (): Promise<void> => {
  const imageFiles: string[] = await collectImageFiles(ASSETS_DIR);
  const summary: OptimizationSummary = {
    scannedFiles: imageFiles.length,
    optimizedFiles: 0,
    savedBytes: 0,
  };

  for (const filePath of imageFiles) {
    const savedBytes: number = await optimizeFile(filePath);
    if (savedBytes > 0) {
      summary.optimizedFiles += 1;
      summary.savedBytes += savedBytes;
      console.log(
        `optimized ${path.relative(process.cwd(), filePath)} (-${formatBytes(savedBytes)})`,
      );
    }
  }

  console.log(
    [
      `Done.`,
      `Scanned: ${summary.scannedFiles}`,
      `Optimized: ${summary.optimizedFiles}`,
      `Saved: ${formatBytes(summary.savedBytes)}`,
    ].join(" "),
  );
};

run().catch((error: unknown) => {
  const message: string = error instanceof Error ? error.message : String(error);
  console.error(`Asset optimization failed: ${message}`);
  process.exitCode = 1;
});
