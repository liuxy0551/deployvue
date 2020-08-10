const archiver = require('archiver')
const fs = require('fs')
const chalk = require('chalk')
const deployConfig = require('./deployConfig')

module.exports = {
  // 递归扫描 5 层，压缩打包后的文件夹为 zip
  async createZip () {
    const output = fs.createWriteStream(`${ process.cwd() }/${ deployConfig.archiveRootDir }.zip`)
    const archive = archiver('zip', {
      zlib: { level: 9 } // 压缩级别
    })

    // 通过管道方法将输出流存档到文件
    archive.pipe(output)
    // 把打包后的文件夹压缩
    archive.directory(`${ process.cwd() }/${ deployConfig.archiveRootDir }`, `${ deployConfig.archiveRootDir }`)

    output.on('close', err => {
      if (err) {
        return console.log('关闭 archiver 异常：', err)
      }
      console.log(chalk.green(`Create ${ deployConfig.archiveRootDir }.zip complete, ${ archive.pointer() } bytes.`))
      // console.log(`开始上传 ${ deployConfig.archiveRootDir }.zip 到服务器`)
      this.uploadFile()
    })
    archive.on('error', err => {
      throw err
    })

    // 完成归档
    archive.finalize()
  },

  // 上传压缩包到服务器
  async uploadFile () {
    console.log('uploadFile')
  }
}
