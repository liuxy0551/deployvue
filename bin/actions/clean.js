const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function () {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist()
  
  console.log(chalk.cyan(`==================== Start clean ====================\n`))

  // 清理本地打包临时文件
  if (shell.exec(`rm -rf ${ tools.deployConfig.archiveRootDir }*`).code !== 0) {
    shell.echo(`Clean Error`)
    shell.exit(1)
    return
  }
  console.log(chalk.green(`DONE  clean complete`))
  // console.log(chalk.green(`DONE  Delete ${ tools.deployConfig.archiveRootDir }`))
  // console.log(chalk.green(`DONE  Delete ${ tools.deployConfig.archiveRootDir }.tar`))
}
