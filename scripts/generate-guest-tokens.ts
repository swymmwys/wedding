import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  generatePrefixedGuestToken,
  prefixNibbleCountForGuestCount,
} from '@wedding/guest-tokens'

type GuestLine = { real_name: string }

type GuestRow = { token: string; real_name: string }

type AllowedGuestTokensFile = { tokens: string[] }

const CSV_HEADER = 'token,real_name' as const

function parseGuestLines(fileContent: string): GuestLine[] {
  const lines: GuestLine[] = []
  for (const line of fileContent.split(/\r?\n/)) {
    const real_name = line.trim()
    if (real_name.length === 0) continue
    lines.push({ real_name })
  }
  return lines
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

function buildGuestRows(
  rows: ReadonlyArray<GuestLine>,
  prefixNibbleCount: number,
): GuestRow[] {
  const out: GuestRow[] = []
  for (const { real_name } of rows) {
    const token: string | null = generatePrefixedGuestToken(
      real_name,
      prefixNibbleCount,
    )
    if (token === null) {
      throw new Error(`Could not build token for guest line: ${real_name}`)
    }
    out.push({ token, real_name })
  }
  return out
}

function buildCsvContent(guestRows: ReadonlyArray<GuestRow>): string {
  const bodyLines: string[] = [CSV_HEADER]
  for (const { token, real_name } of guestRows) {
    bodyLines.push(`${escapeCsvField(token)},${escapeCsvField(real_name)}`)
  }
  return `${bodyLines.join('\n')}\n`
}

const projectRoot: string = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const guestsPath: string = resolve(projectRoot, 'guests.txt')
const outputPath: string = resolve(projectRoot, 'guest_tokens.csv')
const allowedTokensJsonPath: string = resolve(projectRoot, 'allowed_guest_tokens.json')

let fileContent: string
try {
  fileContent = readFileSync(guestsPath, 'utf8')
} catch (err) {
  console.error(`Could not read ${guestsPath} (one guest per non-empty line).`)
  throw err
}

const guests: GuestLine[] = parseGuestLines(fileContent)
const prefixNibbleCount: number = prefixNibbleCountForGuestCount(guests.length)
const guestRows: GuestRow[] = buildGuestRows(guests, prefixNibbleCount)
const csv: string = buildCsvContent(guestRows)
writeFileSync(outputPath, csv, { encoding: 'utf8' })
console.log(`Wrote ${outputPath} (${guests.length} row(s) + header).`)

const allowedFile: AllowedGuestTokensFile = {
  tokens: guestRows.map((row) => row.token),
}
const jsonText: string = `${JSON.stringify(allowedFile, null, 2)}\n`
writeFileSync(allowedTokensJsonPath, jsonText, { encoding: 'utf8' })
console.log(`Wrote ${allowedTokensJsonPath} (${allowedFile.tokens.length} token(s)).`)
