const chalk = require('chalk')
const shell = require('shelljs')
const tools = require('../tools')

module.exports = async function (cmd) {
  // 检查是否有配置文件
  tools.deployConfig.checkDeployConfigExist()

  // 检查配置文件中的部署环境 - 默认production环境
  let deployEnv = tools.deployConfig.checkEnv(cmd, 'rollback')

  // 连接服务器
  let sshGroup = new tools.SSHGroup(deployEnv['servers'])
  await sshGroup.connect()

  for (let ssh of sshGroup.connects) {
    let res = await ssh.execCommand(`cd ${ tools.deployConfig.deployTo }/${ tools.deployConfig.archiveRootDir }-history; ls`)
    let list = res.stdout.split('\n')
    if (list.length >= 2) { // 有两次及以上的部署历史才有版本回退的意义
      let previous = list[list.length - 2]
      await ssh.execCommand(`cd ${ tools.deployConfig.deployTo }/${ tools.deployConfig.archiveRootDir }-history; mv ${ previous } ../; cd ..; tar xvf ${ previous }; rm -rf ${ previous }`)
      console.log(chalk.green(`\nRollback success`))
      shell.exit(0)
    } else if (list.length && list[0]) { // 仅有一次，没有回退的意义
      console.log(chalk.yellow(`\nThere is only one history in this server.`))
      shell.exit(1) // 退出程序
      break
    } else {
      console.log(chalk.yellow(`\nNo history file. Please deploy first.`))
      shell.exit(1) // 退出程序
      break
    }
  }
}
