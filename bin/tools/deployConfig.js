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
  // 部署到该路径
  deployTo: deployConfig['default']['deployTo'],
  // 服务器端保留的历史版本数，可用于回滚的版本数，默认5次
  keepReleases: deployConfig['default']['keepReleases'] || 5,
  // 打包后的文件夹，默认dist
  archiveRootDir: deployConfig['default']['archive']['rootDir'] || 'dist',
  // 测试服配置项
  staging: deployConfig.staging,
  // 正式服配置项
  production: deployConfig.production
}
