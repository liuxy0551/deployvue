const chalk = require('chalk')
const fse = require('fs-extra')
const shell = require('shelljs')
const tools = require('../tools')

const deployConfigFilePath = `${ process.cwd() }/deploy.config.json`
const deployConfig = fse.readJSONSync(deployConfigFilePath)

module.exports = async function (cmd) {
  // 检查配置文件中的部署环境
  if (!cmd.env || !deployConfig[cmd.env]) {
    console.log(chalk.red(`Please ensure your deploy env is effective. eg: deployvue deploy -e staging`))
    shell.exit(1) // 退出程序
    return
  }

  // 处理打包后的压缩包
  tools.fileZip.createZip()

  // 连接服务器
  // let sshGroup = new tools.SSHGroup(deployConfig[cmd.env]['servers'])
  // await sshGroup.connect()
}
