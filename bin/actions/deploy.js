const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function (cmd) {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist()

  // 检查配置文件中的部署环境 - 默认production环境
  let env = cmd.env || 'production'
  let deployEnv = tools.deployConfig.checkEnv(cmd, 'deploy')

  // 检查是否有打包后的文件夹
  let exist = fs.existsSync(`${ tools.deployConfig.archiveRootDir }`)
  if (!exist) {
    console.log(chalk.red(`The ${ tools.deployConfig.archiveRootDir } folder is not found, please build first. eg: `), chalk.bgCyan(`deployvue build -e staging or deployvue build`))
    shell.exit(1) // 退出程序
    return
  }


  // console.log(`==================== start deploy ====================\n`)

  // 打包带上时间和时间戳
  let year = new Date().getFullYear()
  let month = new Date().getMonth() + 1
  let day = new Date().getDate()
  let hour = new Date().getHours()
  let minute = new Date().getMinutes()
  let second = new Date().getSeconds()
  const date = `${ year }${ month < 10 ? `0${ month }` : month }${ day < 10 ? `0${ day }` : day }${ hour < 10 ? `0${ hour }` : hour }${ minute < 10 ? `0${ minute }` : minute }${ second < 10 ? `0${ second }` : second }`

  // 压缩打包后的文件夹
  await tools.file.archiveFile(date)

  // 连接服务器
  let sshGroup = new tools.SSHGroup(deployEnv['servers'])
  await sshGroup.connect()

  // scp 将打包后的压缩包上传到服务器指定路径
  await tools.file.putFiles(sshGroup.connects, env, date)

  // 在服务器端解压压缩包
  await tools.file.unArchiveFile(sshGroup.connects, date)

  console.log('\n', chalk.bgGreen(' DONE '), chalk.green('deploy success\n'))
  console.log(`==================== complete, enjoy ====================\n`)
  shell.exit(0) // 部署完成，结束程序
}
