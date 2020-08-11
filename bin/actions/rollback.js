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
    console.log(chalk.red(`Please ensure your deploy env is effective. eg: deployvue build -e staging or deployvue build`))
    shell.exit(1) // 退出程序
    return
  }

  return
  // 安装依赖和打包命令集
  const installCommands = deployEnv.installCommands || []
  const buildCommands = deployEnv.buildCommands || ['npm run build']

  // 依次执行安装依赖命令
  if (installCommands.length) {
    console.log(`==================== install dependencies ====================\n`)
    for (let command of installCommands) {
      console.log(`+ ${ command }`)
      if (shell.exec(`${ command }`).code !== 0) {
        shell.echo(`Run: ${ command } Error`)
        shell.exit(1)
        return
      }
      console.log(chalk.cyan(`DONE  ${ command } complete\n`))
    }
    console.log(`==================== install complete ====================\n`)
  }

  // 依次执行打包命令
  console.log(`==================== start ====================\n`)
  for (let command of buildCommands) {
    console.log(`+ ${ command }`)
    if (shell.exec(`${ command }`).code !== 0) {
      shell.echo(`Run: ${ command } Error`)
      shell.exit(1)
      return
    }
    // console.log(chalk.green(`DONE  ${ command } complete\n`))
  }
  // console.log(`==================== build complete ====================\n\n`)
}
