const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function (cmd) {
  // 检查配置文件中的部署环境
  let deployEnv = tools.deployConfig[cmd.env]
  if (!cmd.env || !deployEnv) {
    console.log(chalk.red(`Please ensure your deploy env is effective. eg: deployvue deploy -e staging`))
    shell.exit(1) // 退出程序
    return
  }

  // 处理打包后的压缩包
  await tools.file.createZip()

  // 连接服务器
  // let sshGroup = new tools.SSHGroup(tools.deployConfig[cmd.env]['servers'])
  // await sshGroup.connect()
}
