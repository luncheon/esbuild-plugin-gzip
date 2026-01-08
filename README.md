# esbuild-plugin-gzip

Gzip and Brotli compression for [esbuild](https://esbuild.github.io/).

## Installation

```sh
$ npm i -D esbuild @luncheon/esbuild-plugin-gzip
```

## Usage Example

```js
const esbuild = require('esbuild')
const gzipPlugin = require('@luncheon/esbuild-plugin-gzip')

esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  write: false, // write must be false
  plugins: [gzipPlugin()],
})
```

## Options

```js
gzipPlugin({
  uncompressed: true, // raw output file emission
  gzip: true,         // gzip compressed output file emission
  brotli: true,       // brotli compressed output file emission
  onEnd: ({ outputFiles }) => {
    // outputFiles.forEach(({ path, contents }) => {})
  },
})
```

Each file emission option can be an object with:

- `filter: RegExp | { test: (outputFilePath: string, outputFile: OutputFile) => boolean }`

```js
gzipPlugin({
  gzip: {
    filter: /\.(js|css)$/i,
  },
  brotli: {
    filter: {
      test: (_outputFilePath, outputFile) => outputFile.contents.byteLength > 1_000_000,
    },
  },
})
```

## License

[WTFPL](http://www.wtfpl.net/)
