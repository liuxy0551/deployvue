const archiver = require('archiver')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const deployConfig = require('./deployConfig')

module.exports = {
  // 压缩打包后的文件夹
  async archiveFile (date) {
    return new Promise((resolve, reject) => {
      console.log(`\narchive ${ deployConfig.archiveRootDir }-${ date }.tar`)

      const output = fs.createWriteStream(`${ process.cwd() }/${ deployConfig.archiveRootDir }-${ date }.tar`)
      const archive = archiver('tar', {
        zlib: { level: 9 } // 压缩级别
      })

      // 通过管道方法将输出流存档到文件
      archive.pipe(output)
      // 把打包后的文件夹压缩
      archive.directory(`${ process.cwd() }/${ deployConfig.archiveRootDir }`, false)

      output.on('close', err => {
        if (err) {
          reject(err)
          return console.log('关闭 archiver 异常：', err)
        }
        console.log(chalk.cyan(`DONE  Create archive file complete. The ${ deployConfig.archiveRootDir }-${ date }.tar has ${ archive.pointer() } bytes.\n`))
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

  async putFiles (connects, env, date) {
    // 在服务器上创建对应的部署目录
    for (let ssh of connects) {
      await ssh.execCommand(`mkdir -p ${ deployConfig.deployTo }/${ deployConfig.archiveRootDir }-history`)
    }

    return new Promise((resolve, reject) => {
      // 通过scp命令往服务器上推压缩包，文件 scp，目录 scp -r
      let localFile = `${ deployConfig.archiveRootDir }-${ date }.tar`
      let deployTo = `${ deployConfig.deployTo }`

      for (let server of deployConfig[env].servers) {
        let command = `scp ${ localFile } ${ server.username }@${ server.host }:${ deployTo }`
        console.log(`\n+ ${ command }`)
        if (shell.exec(`${ command }`).code !== 0) {
          shell.echo(`Run: ${ command } Error`)
          shell.exit(1)
          reject()
        }
        console.log(chalk.cyan(`DONE  ${ command } complete`))
      }
      resolve()
    })
  },

  // 在服务器端解压压缩包
  async unArchiveFile (connects, date) {
    let unArchiveCommand = `tar xvf ${ deployConfig.archiveRootDir }-${ date }.tar`
    for (let ssh of connects) {
      console.log(`\n+ ${ unArchiveCommand }`)
      // 把压缩包 move 到备份文件夹
      await ssh.execCommand(`cd ${ deployConfig.deployTo }; ${ unArchiveCommand }; mv ${ deployConfig.archiveRootDir }-${ date }.tar ${ deployConfig.archiveRootDir }-history`)
      // 仅保留特定数量的压缩包文件 - 保留文件夹下最新的特定数量文件
      await ssh.execCommand(`cd ${ deployConfig.deployTo }/${ deployConfig.archiveRootDir }-history; ls -t | awk 'NR > ${ deployConfig.keepReleases + 1 } {print "rm -rf "$0}' | sh`)
      console.log(chalk.cyan(`unArchive file success`))
    }
  }
}
