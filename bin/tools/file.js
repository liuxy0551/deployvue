const archiver = require('archiver')
const fs = require('fs')
const chalk = require('chalk')
const deployConfig = require('./deployConfig')

module.exports = {
  // 压缩打包后的文件夹
  async createCompressFile () {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(`${ process.cwd() }/${ deployConfig.archiveRootDir }.tar`)
      const archive = archiver('tar', {
        zlib: { level: 9 } // 压缩级别
      })
  
      console.log(chalk.cyan(`==================== Start deploy ====================\n`))
      console.log(chalk.cyan(`compressing ${ deployConfig.archiveRootDir }.tar\n`))
  
      // 通过管道方法将输出流存档到文件
      archive.pipe(output)
      // 把打包后的文件夹压缩
      archive.directory(`${ process.cwd() }/${ deployConfig.archiveRootDir }`, false)
  
      output.on('close', err => {
        if (err) {
          reject(err)
          return console.log('关闭 archiver 异常：', err)
        }
        console.log(chalk.green(`DONE  Create compress file complete. The ${ deployConfig.archiveRootDir }.tar has ${ archive.pointer() } bytes.\n`))
        resolve()
      })
      archive.on('error', err => {
        reject(err)
        throw err
      })
  
      // 完成归档
      archive.finalize()
    })
  }
}
