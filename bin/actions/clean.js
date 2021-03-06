const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function () {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist()

  // 清理本地打包临时文件
  if (shell.exec(`rm -rf ${ tools.deployConfig.archiveRootDir }${ tools.deployConfig.cleanRange }`).code !== 0) {
    shell.echo(`Clean Error`)
    shell.exit(1)
  }
  // console.log(chalk.cyan(`DONE  temporary files clean complete`))
}
