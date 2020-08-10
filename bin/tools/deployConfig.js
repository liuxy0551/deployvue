const fse = require('fs-extra')

const deployConfigFilePath = `${ process.cwd() }/deploy.config.json`
const deployConfig = fse.readJSONSync(deployConfigFilePath)

module.exports = {
  // 项目名称
  projectName: deployConfig['default']['projectName'],
  // 部署到该路径
  deployTo: deployConfig['default']['deployTo'],
  // 服务器端保留的历史版本数，可用于回滚的版本数
  keepReleases: deployConfig['default']['keepReleases'],
  // 打包后的文件夹
  archiveRootDir: deployConfig['default']['archive']['rootDir']
}
