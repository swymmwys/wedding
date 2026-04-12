/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPS_SCRIPT_URL?: string
  /** JSON string: JWK public key for RS256 guest JWTs */
  readonly VITE_JWT_PUBLIC_JWK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
