const NodeSSH = require('node-ssh')
const chalk = require('chalk')
const homedir = require('os').homedir()

module.exports = class SSHGroup {
  // 构造函数
  constructor (servers) {
    this.servers = servers
    this.connects = []
  }

  // 连接服务器
  connect () {
    return new Promise((resolve, reject) => {
      for (let server of this.servers) {
        console.log(`${ server.host } connecting ...`)
        const ssh = new NodeSSH()
        ssh.connect(Object.assign({ privateKey: `${ homedir }/.ssh/id_rsa` }, server)).then(res => {
          console.log(chalk.cyan(`${ server.host } connected\n`))
          this.connects.push(ssh)
          if (this.connects.length === this.servers.length) {
            resolve(this.connects)
          }
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}
