const fse = require('fs-extra')

const deployConfigFilePath = `${ process.cwd() }/deploy.config.json`
const deployConfig = fse.readJSONSync(deployConfigFilePath)

// console.log(deployConfig['default']['projectName'])



module.exports = async function (cmd) {
  console.log(cmd.env)
}
