import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  generatePrefixedGuestToken,
  prefixNibbleCountForGuestCount,
} from '@wedding/guest-tokens'

type LinkPair = [string, string]

type AllowedGuestTokensFile = { tokens: string[]; links: LinkPair[] }
type GuestEntry = { label: string; token: string }
type ExistingAssignmentsByLabel = Map<string, string[]>

function readDomainFromCname(projectRootDir: string): string {
  const cnamePath: string = resolve(projectRootDir, 'CNAME')
  let text: string
  try {
    text = readFileSync(cnamePath, 'utf8')
  } catch (err) {
    console.error(`Could not read ${cnamePath} (domain, one line).`)
    throw err
  }
  const domain: string = text.trim()
  if (domain.length === 0) {
    throw new Error(`CNAME at ${cnamePath} is empty.`)
  }
  return domain
}

function guestInviteUrl(domain: string, token: string): string {
  const url: URL = new URL(`https://${domain}/`)
  url.searchParams.set('g', token)
  return url.toString()
}

function parseGuestLabels(fileContent: string): string[] {
  const labels: string[] = []
  for (const line of fileContent.split(/\r?\n/)) {
    const label: string = line.trim()
    if (label.length === 0) continue
    labels.push(label)
  }
  return labels
}

function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value)) {
    return false
  }
  return value.every((entry: unknown): boolean => typeof entry === 'string')
}

function isLinkPairArray(value: unknown): value is LinkPair[] {
  if (!Array.isArray(value)) {
    return false
  }
  return value.every((entry: unknown): boolean => {
    if (!Array.isArray(entry) || entry.length !== 2) {
      return false
    }
    return typeof entry[0] === 'string' && typeof entry[1] === 'string'
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseAllowedGuestTokensFile(fileContent: string): AllowedGuestTokensFile {
  const parsed: unknown = JSON.parse(fileContent)
  if (!isRecord(parsed)) {
    throw new Error('allowed_guest_tokens.json must contain an object.')
  }
  if (!isStringArray(parsed.tokens)) {
    throw new Error('allowed_guest_tokens.json field "tokens" must be string[].')
  }
  if (!isLinkPairArray(parsed.links)) {
    throw new Error(
      'allowed_guest_tokens.json field "links" must be [string, string][].',
    )
  }
  return {
    tokens: parsed.tokens,
    links: parsed.links,
  }
}

function extractTokenFromInviteUrl(urlText: string): string | null {
  try {
    const parsedUrl: URL = new URL(urlText)
    const token: string | null = parsedUrl.searchParams.get('g')
    if (token === null) return null
    const trimmedToken: string = token.trim()
    return trimmedToken.length > 0 ? trimmedToken : null
  } catch {
    return null
  }
}

function buildExistingAssignmentsByLabel(
  allowedFile: AllowedGuestTokensFile,
): ExistingAssignmentsByLabel {
  const assignmentsByLabel: ExistingAssignmentsByLabel = new Map<
    string,
    string[]
  >()
  for (const [label, inviteLink] of allowedFile.links) {
    const token: string | null = extractTokenFromInviteUrl(inviteLink)
    if (token === null) continue
    const currentTokens: string[] | undefined = assignmentsByLabel.get(label)
    if (currentTokens === undefined) {
      assignmentsByLabel.set(label, [token])
      continue
    }
    currentTokens.push(token)
  }
  return assignmentsByLabel
}

function takeExistingTokenIfAvailable(
  assignmentsByLabel: ExistingAssignmentsByLabel,
  label: string,
): string | null {
  const existingTokens: string[] | undefined = assignmentsByLabel.get(label)
  if (existingTokens === undefined || existingTokens.length === 0) {
    return null
  }
  const token: string | undefined = existingTokens.shift()
  if (token === undefined) return null
  if (existingTokens.length === 0) {
    assignmentsByLabel.delete(label)
  }
  return token
}

function generateUniqueGuestToken(
  label: string,
  prefixNibbleCount: number,
  usedTokens: ReadonlySet<string>,
): string {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate: string | null = generatePrefixedGuestToken(
      label,
      prefixNibbleCount,
    )
    if (candidate === null) {
      throw new Error(`Could not build token for guest label: ${label}`)
    }
    if (!usedTokens.has(candidate)) {
      return candidate
    }
  }
  throw new Error(`Could not generate unique token for guest label: ${label}`)
}

function collectAllTokensInOrder(
  guestEntries: ReadonlyArray<GuestEntry>,
): string[] {
  const tokens: string[] = []
  const seenTokens: Set<string> = new Set<string>()
  for (const { token } of guestEntries) {
    if (seenTokens.has(token)) continue
    seenTokens.add(token)
    tokens.push(token)
  }
  return tokens
}

const projectRoot: string = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const guestsPath: string = resolve(projectRoot, 'guests.txt')
const allowedTokensJsonPath: string = resolve(projectRoot, 'allowed_guest_tokens.json')

let guestsFileContent: string
try {
  guestsFileContent = readFileSync(guestsPath, 'utf8')
} catch (err) {
  console.error(`Could not read ${guestsPath} (one guest per non-empty line).`)
  throw err
}

let allowedTokensFileContent: string
try {
  allowedTokensFileContent = readFileSync(allowedTokensJsonPath, 'utf8')
} catch (err) {
  console.error(`Could not read ${allowedTokensJsonPath}.`)
  throw err
}

const guestLabels: string[] = parseGuestLabels(guestsFileContent)
const existingAllowedFile: AllowedGuestTokensFile = parseAllowedGuestTokensFile(
  allowedTokensFileContent,
)
const existingAssignmentsByLabel: ExistingAssignmentsByLabel =
  buildExistingAssignmentsByLabel(existingAllowedFile)
const prefixNibbleCount: number = prefixNibbleCountForGuestCount(guestLabels.length)
const usedTokens: Set<string> = new Set<string>()
const nextGuestEntries: GuestEntry[] = []
let generatedTokenCount = 0

for (const label of guestLabels) {
  const existingToken: string | null = takeExistingTokenIfAvailable(
    existingAssignmentsByLabel,
    label,
  )
  if (existingToken !== null && !usedTokens.has(existingToken)) {
    usedTokens.add(existingToken)
    nextGuestEntries.push({ label, token: existingToken })
    continue
  }
  const token: string = generateUniqueGuestToken(label, prefixNibbleCount, usedTokens)
  usedTokens.add(token)
  generatedTokenCount += 1
  nextGuestEntries.push({ label, token })
}

const siteDomain: string = readDomainFromCname(projectRoot)
const allowedFile: AllowedGuestTokensFile = {
  tokens: collectAllTokensInOrder(nextGuestEntries),
  links: nextGuestEntries.map(
    (entry): LinkPair => [entry.label, guestInviteUrl(siteDomain, entry.token)],
  ),
}
const jsonText: string = `${JSON.stringify(allowedFile, null, 2)}\n`
writeFileSync(allowedTokensJsonPath, jsonText, { encoding: 'utf8' })
console.log(
  `Wrote ${allowedTokensJsonPath} (${allowedFile.links.length} link(s), ${allowedFile.tokens.length} unique token(s), ${generatedTokenCount} new token(s)).`,
)
