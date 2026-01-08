import type { OutputFile, Plugin } from 'esbuild'

export interface CompressResult {
  outputFiles: {
    path: string
    contents: Buffer
  }[]
}

export interface CompressOption {
  readonly filter: RegExp | { readonly test: (path: string, outputFile: OutputFile) => boolean }
}

export interface Options {
  readonly uncompressed?: boolean | CompressOption
  readonly gzip?: boolean | CompressOption
  readonly brotli?: boolean | CompressOption
  onEnd?(result: CompressResult): void
}

declare const plugin: (options: Options) => Plugin

export default plugin

export = plugin
