const fs = require('fs')
const chalk = require('chalk');

module.exports = async function () {
  let exist = fs.existsSync('deploy.config.js')
  if (!exist) {
    // 初始化项目的部署配置文件
    fs.readFile(`${ __dirname.split('bin/')[0] }/init/deploy.config.js`, function (err, data) {
      fs.writeFile(`${ process.cwd() }/deploy.config.js`, data, function (err) {
        if (err) {
          throw err
        }
        console.log(chalk.green(`DONE  init success \n\n`))
      })
    })
  } else {
    console.log(chalk.yellow(`Fail: deploy.config.js already exist \n\n`))
  }
}
