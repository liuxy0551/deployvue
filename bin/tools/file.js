const archiver = require('archiver')
const fs = require('fs')
const chalk = require('chalk')
const deployConfig = require('./deployConfig')

module.exports = {
  // 压缩打包后的文件夹为 zip
  async createZip () {
    const output = fs.createWriteStream(`${ process.cwd() }/${ deployConfig.archiveRootDir }.zip`)
    const archive = archiver('zip', {
      zlib: { level: 9 } // 压缩级别
    })

    console.log(chalk.cyan(`==================== Start deploy ====================\n`))
    console.log(chalk.cyan(`compressing ${ deployConfig.archiveRootDir }.zip\n`))

    // 通过管道方法将输出流存档到文件
    archive.pipe(output)
    // 把打包后的文件夹压缩
    archive.directory(`${ process.cwd() }/${ deployConfig.archiveRootDir }`, false)

    output.on('close', err => {
      if (err) {
        return console.log('关闭 archiver 异常：', err)
      }
      console.log(chalk.green(`DONE  Create zip file complete. The ${ deployConfig.archiveRootDir }.zip has ${ archive.pointer() } bytes.`))
    })
    archive.on('error', err => {
      throw err
    })

    // 完成归档
    archive.finalize()
  }
}
