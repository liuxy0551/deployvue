# deployvue [![npm](https://img.shields.io/npm/v/deployvue.svg?style=flat-square)](https://www.npmjs.com/package/deployvue)

deploy vue project —— 自动化部署<br><br>

### deployvue 部署流程

1、执行 build 命令  
2、自动压缩打包后的文件夹  
3、连接服务器，创建部署目录及备份目录（用于回退版本）  
4、scp 将打包后的压缩包上传到服务器指定路径  
5、利用已有的服务器连接，在服务器端解压压缩包  
6、删除本地的打包文件及压缩包，部署完成  
**7、支持回退版本**

### 安装

```
$ npm i deployvue -g
```


### 使用

1、参考 <a href="https://liuxianyu.cn/article/cent-os-base.html#%E4%BA%8C-%E6%B7%BB%E5%8A%A0%E6%9C%AC%E6%9C%BA%E7%9A%84-ssh-%E5%85%AC%E9%92%A5%E5%88%B0%E6%9C%8D%E5%8A%A1%E5%99%A8" target="_black">添加本机的 SSH 公钥到服务器</a> 进行本机与服务器连接的准备工作；

2、执行 `deployvue init`，在生成的 `deploy.config.js` 中进行自定义设置；

3、在 `package.json` 中新增 `deploy` 相关命令，即可使用 `npm run deploy` 或 `npm run deploy:staging` 进行正式环境或测试环境部署
```
// package.json

"scripts": {
  "build": "vue-cli-service build",
  "build:staging": "vue-cli-service build --mode staging",
  "deploy": "deployvue build && deployvue deploy && deployvue clean",
  "deploy:staging": "deployvue build -e staging && deployvue deploy -e staging && deployvue clean"
}
```

```
# 查看版本
$ deployvue -V / --version

# 初始化项目的部署配置文件
$ deployvue init

# 打包项目代码
$ deployvue build -e staging / deployvue build

# 部署到指定环境的服务器
$ deployvue deploy -e staging / deployvue deploy

# 回退到上一次部署的版本
$ deployvue rollback -e staging / deployvue rollback

# 清理本地打包临时文件
$ deployvue clean

deployvue build 等同于 deployvue build -e production
```

相关随笔：<a href="https://liuxianyu.cn/article/deploy-vue.html" target="_black">写一个 Vue 项目的自动化部署插件</a>
