import 'vite'

declare module 'vite' {
  interface UserConfig {
    ssgOptions?: {
      script?: 'defer' | 'async' | 'blocking' | 'module' | ((filepath: string) => string)
    }
  }
}
