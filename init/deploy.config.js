module.exports = {
  default: {
    projectName: 'my-vue', // 项目名称
    deployTo: '/mnt/projects/my-vue', // 部署到服务器的路径
    repositoryUrl: 'git:// or http://git...', // 代码仓库git地址
    keepReleases: 5, // 支持回退几次版本
    archive: {
      rootDir: 'docs', // 打包后的文件夹名，默认dist
      only: ['*']
    },
    shared: {
      dirs: ['node_modules'],
      files: []
    }
  },
  // 测试环境
  staging: {
    // 需要部署的服务器列表
    servers: [
      {
        host: '47.99.64.142',
        username: 'deploy'
      }
    ],
    branch: 'develop', // 分支名
    installCommands: [], // 安装依赖命令集，默认为 []
    buildCommands: ['npm run build:staging'] // 打包命令集，默认为 ['npm run build']
  },
  // 正式环境
  production: {
    // 需要部署的服务器列表
    servers: [
      {
        host: '47.99.64.142',
        username: 'deploy'
      }
    ],
    branch: 'master', // 分支名
    installCommands: [], // 安装依赖命令集，默认为 []
    buildCommands: ['npm run build'] // 打包命令集，默认为 ['npm run build']
  }
}
