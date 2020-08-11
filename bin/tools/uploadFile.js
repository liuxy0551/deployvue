const deployConfig = require('./deployConfig')
const chalk = require('chalk')
const shell = require('shelljs')

module.exports = {
  // 通过scp往服务器上推压缩包，文件 scp，目录 scp -r
  async putFiles (env) {
    // let localFile = `${ process.cwd() }/${ deployConfig.archiveRootDir }.tar`
    let localFile = `${ deployConfig.archiveRootDir }.tar`
    let deployTo = `${ deployConfig.deployTo }`

    for (let server of deployConfig[env].servers) {
      let command = `scp ${ localFile } ${ server.username }@${ server.host }:${ deployTo }`
      console.log(chalk.cyan(`+ ${ command }`))
      if (shell.exec(`${ command }`).code !== 0) {
        shell.echo(`Run: ${ command } Error`)
        shell.exit(1)
        return
      }
      console.log(chalk.green(`DONE  ${ command } complete`))
    }
  }
}
