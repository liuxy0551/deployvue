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
    await ssh.execCommand(`cd ${ tools.deployConfig.deployTo }/${ tools.deployConfig.archiveRootDir }-history; ls`).then(res => {
      console.log(res)

      // let list = res.stdout.split('\n').filter(i => i.includes(tools.deployConfig.archiveRootDir))
      // let timeList = list.map(i => i.split('-')[2].split('.tar')[0])
      // console.log(timeList.sort()[timeList.length - 2])
      // console.log(list.filter(i => i.includes(Math.max(...timeList))))
      // let time = ''
    })
  }
}
