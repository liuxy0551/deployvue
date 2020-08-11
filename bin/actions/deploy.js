const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function (cmd) {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist()

  // 检查配置文件中的部署环境 - 默认production环境
  let env = cmd.env || 'production'
  let deployEnv = tools.deployConfig[env]
  if (!deployEnv) {
    console.log(chalk.red(`Please ensure your deploy env is effective. eg: deployvue deploy -e staging or deployvue deploy`))
    shell.exit(1) // 退出程序
    return
  }

  // 检查是否有打包后的文件夹
  let exist = fs.existsSync(`${ tools.deployConfig.archiveRootDir }`)
  if (!exist) {
    console.log(chalk.red(`Please build first. eg: deployvue build -e staging or deployvue build`))
    shell.exit(1) // 退出程序
    return
  }

  // 压缩打包后的文件夹
  await tools.file.createCompressFile()

  // scp 将打包后的压缩包上传到服务器指定路径
  await tools.uploadFile.putFiles(env)

  // 连接服务器
  // let sshGroup = new tools.SSHGroup(tools.deployConfig[cmd.env]['servers'])
  // await sshGroup.connect()
}
