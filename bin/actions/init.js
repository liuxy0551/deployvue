const fs = require('fs')
const chalk = require('chalk');

module.exports = async function () {
  // 先判断是否已有配置文件
  let exist = fs.existsSync('deploy.config.js')
  if (!exist) {
    // 初始化项目的部署配置文件
    fs.copyFileSync(`${ __dirname.split('bin/')[0] }/init/deploy.config.js`, `${ process.cwd() }/deploy.config.js`)
    console.log(chalk.bgGreen(`DONE`), chalk.green(`init success`))

    // 也可以通过 readFile 和 writeFile 实现
    // fs.readFile(`${ __dirname.split('bin/')[0] }/init/deploy.config.js`, function (error, data) {
    //   fs.writeFile(`${ process.cwd() }/deploy.config.js`, data, function (err) {
    //     if (err) {
    //       throw err
    //     }
    //     console.log(chalk.bgGreen(`DONE`), chalk.green(`init success`))
    //   })
    // })
  } else {
    console.log(chalk.yellow(`Fail: deploy.config.js already exist`))
  }
}
