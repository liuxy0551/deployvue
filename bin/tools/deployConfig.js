const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')

let exist = fs.existsSync(`${ process.cwd() }/deploy.config.js`)
const deployConfig = require(exist ? `${ process.cwd() }/deploy.config.js` : `${ __dirname.split('bin/')[0] }/init/deploy.config.js`)

module.exports = {
  // 项目中是否存在deploy.config.js
  checkDeployConfigExist: function () {
    if (!exist) {
      console.log(chalk.red(`You are using deployvue without deploy.config.js. Please init. eg: deployvue init\n`))
      shell.exit(1) // 退出程序
      return
    }
  },
  // 检查配置文件中的部署环境 - 默认production环境
  checkEnv (cmd, order) {
    let env = cmd.env || 'production'
    let deployEnv = deployConfig[env]
    if (!deployEnv) {
      console.log(chalk.red(`Please ensure your deploy.config.js env is effective. eg: deployvue ${ order } -e staging / deployvue ${ order } (-e production)`))
      shell.exit(1) // 退出程序
      return
    }
    return deployEnv
  },
  // 部署到该路径
  deployTo: deployConfig['default']['deployTo'],
  // 服务器端保留的历史版本数，可用于回退的版本数，默认5次
  keepReleases: deployConfig['default']['keepReleases'] || 5,
  // 打包后的文件夹，默认dist
  archiveRootDir: deployConfig['default']['archive']['rootDir'] || 'dist',
  // 测试服配置项
  staging: deployConfig.staging,
  // 正式服配置项
  production: deployConfig.production
}
