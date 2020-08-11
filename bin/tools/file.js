const archiver = require('archiver')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const deployConfig = require('./deployConfig')

module.exports = {
  // 压缩打包后的文件夹
  async archiveFile () {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(`${ process.cwd() }/${ deployConfig.archiveRootDir }.tar`)
      const archive = archiver('tar', {
        zlib: { level: 9 } // 压缩级别
      })
  
      console.log(chalk.cyan(`==================== Start deploy ====================\n`))
      console.log(chalk.cyan(`archive ${ deployConfig.archiveRootDir }.tar`))
  
      // 通过管道方法将输出流存档到文件
      archive.pipe(output)
      // 把打包后的文件夹压缩
      archive.directory(`${ process.cwd() }/${ deployConfig.archiveRootDir }`, false)
  
      output.on('close', err => {
        if (err) {
          reject(err)
          return console.log('关闭 archiver 异常：', err)
        }
        console.log(chalk.green(`DONE  Create archive file complete. The ${ deployConfig.archiveRootDir }.tar has ${ archive.pointer() } bytes.\n`))
        resolve()
      })
      archive.on('error', err => {
        reject(err)
        throw err
      })
  
      // 完成归档
      archive.finalize()
    })
  },

  async putFiles (connects, env) {
    // 在服务器上创建对应的部署目录
    for (let ssh of connects) {
      console.log(chalk.cyan(`+ mkdir ${ deployConfig.deployTo }`))
      let res = await ssh.execCommand(`mkdir ${ deployConfig.deployTo }`)
      console.log(res.stderr ? chalk.yellow(`${ res.stderr } \n`) : chalk.green(`mkdir ${ deployConfig.deployTo } success\n`))
    }

    return new Promise((resolve, reject) => {
      // 通过scp命令往服务器上推压缩包，文件 scp，目录 scp -r
      // let localFile = `${ process.cwd() }/${ deployConfig.archiveRootDir }.tar`
      let localFile = `${ deployConfig.archiveRootDir }.tar`
      let deployTo = `${ deployConfig.deployTo }`
  
      for (let server of deployConfig[env].servers) {
        let command = `scp ${ localFile } ${ server.username }@${ server.host }:${ deployTo }`
        console.log(chalk.cyan(`+ ${ command }`))
        if (shell.exec(`${ command }`).code !== 0) {
          shell.echo(`Run: ${ command } Error`)
          shell.exit(1)
          reject()
          return
        }
        console.log(chalk.green(`DONE  ${ command } complete\n`))
      }
      resolve()
    })
  },

  // 在服务器端解压压缩包
  async unArchiveFile (connects) {
    let unArchiveCommand = `tar xvf ${ deployConfig.archiveRootDir }.tar`
    for (let ssh of connects) {
      console.log(chalk.cyan(`+ ${ unArchiveCommand }`))
      await ssh.execCommand(`cd ${ deployConfig.deployTo }; ${ unArchiveCommand }; rm -rf ${ deployConfig.archiveRootDir }.tar`)
    console.log(chalk.green(`unArchive file success.\n`))
    }
    console.log(chalk.green(`DONE  deploy success.\n`))
    shell.exit(0)
  }
}
