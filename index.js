const fs = require('fs/promises')
const path = require('path')
const zlib = require('zlib')
const { promisify } = require('util')

const compressGz = promisify(zlib.gzip)
const compressBr = promisify(zlib.brotliCompress)

const write = async (filename, contents) => {
  await fs.mkdir(path.dirname(filename), { recursive: true })
  await fs.writeFile(filename, contents)
  return { path: filename, contents }
}
const writeGz = async (filename, contents) => await write(filename + '.gz', await compressGz(contents, { level: 9 }))
const writeBr = async (filename, contents) => await write(filename + '.br', await compressBr(contents))

const matches = (outputFile, o) => typeof o?.filter?.test === 'function' ? o.filter.test(outputFile.path, outputFile) : (o ?? true)

const plugin = ({ uncompressed, gzip, brotli, onEnd } = {}) => ({
  name: 'esbuild-plugin-gzip',
  setup: build => {
    if (build.initialOptions.write !== false) {
      throw Error('`write` option of esbuild must be `false`')
    }
    build.onEnd(async result => {
      const outputFilesPromises = []
      for (const outputFile of result.outputFiles) {
        const { path: filename, contents } = outputFile
        matches(outputFile, uncompressed) && outputFilesPromises.push(write(filename, contents))
        matches(outputFile, gzip) && outputFilesPromises.push(writeGz(filename, contents))
        matches(outputFile, brotli) && outputFilesPromises.push(writeBr(filename, contents))
      }
      onEnd?.({ outputFiles: await Promise.all(outputFilesPromises) })
    })
  },
})

module.exports = plugin.default = plugin
