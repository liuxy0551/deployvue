const fs = require('fs')

let exist = fs.existsSync(`${ process.cwd() }/deploy.config.js`)
const deployConfig = require(exist ? `${ process.cwd() }/deploy.config.js` : `${ __dirname.split('bin/')[0] }/example/deploy.config.js`)

module.exports = {
  // 项目名称
  projectName: deployConfig['default']['projectName'],
  // 部署到该路径
  deployTo: deployConfig['default']['deployTo'],
  // 服务器端保留的历史版本数，可用于回滚的版本数
  keepReleases: deployConfig['default']['keepReleases'],
  // 打包后的文件夹，默认dist
  archiveRootDir: deployConfig['default']['archive']['rootDir'] || 'dist',
  // 测试服配置项
  staging: deployConfig.staging,
  // 正式服配置项
  production: deployConfig.production
}
