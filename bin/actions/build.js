const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function (cmd) {
  // 检查配置文件中的部署环境
  let deployEnv = tools.deployConfig[cmd.env]
  if (!cmd.env || !deployEnv) {
    console.log(chalk.red(`Please ensure your deploy env is effective. eg: deployvue build -e staging`))
    shell.exit(1) // 退出程序
    return
  }

  // 安装依赖和打包命令集
  const installCommands = deployEnv.installCommands || []
  const buildCommands = deployEnv.buildCommands || ['npm run build']

  // 依次执行安装依赖命令
  if (installCommands.length) {
    console.log(chalk.cyan(`==================== Installation dependencies ====================`))
    for (let command of installCommands) {
      console.log(chalk.cyan(command))
      if (shell.exec(`${ command }`).code !== 0) {
        shell.echo(`Run: ${ command } Error`)
        shell.exit(1)
        return
      }
      console.log(chalk.green(`${ command } complete\n`))
    }
  }

  // 依次执行打包命令
  console.log(chalk.cyan(`==================== Begin Build ====================`))
  for (let command of buildCommands) {
    console.log(chalk.cyan(command))
    if (shell.exec(`${ command }`).code !== 0) {
      shell.echo(`Run: ${ command } Error`)
      shell.exit(1)
      return
    }
    console.log(chalk.green(`${ command } complete`))
  }
}
