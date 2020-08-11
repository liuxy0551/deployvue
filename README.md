# deployvue


### 部署基本流程介绍
1、执行 build 命令  
2、压缩打包后的文件夹  
3、ssh 连接服务器，创建部署目录  
4、scp 将打包后的压缩包上传到服务器指定路径  
5、利用已有的 ssh 连接，远程解压压缩包  
6、删除本地的打包文件及压缩包，部署完成  


### 安装
```
$ npm i deployvue -g
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

# 清理本地打包临时文件
$ deployvue clean
```
