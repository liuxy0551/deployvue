#!/usr/bin/env node

const { program } = require('commander')
const packageJson = require('../package.json')

// version
program.version(packageJson.version, '-v, -V, --version')
// init
program.command('init').description('init deploy.config.js').action(require('./actions/init'))
// build
program.command('build').description('build code').option('-e, --env <env>', 'environment', '').action(require('./actions/build'))
// deploy
program.command('deploy').description('deploy project').option('-e, --env <env>', 'environment', '').action(require('./actions/deploy'))
// clean
program.command('clean').description('clean build file').action(require('./actions/clean'))
// rollback
program.command('rollback').description('project rollback deploy').option('-e, --env <env>', 'environment', '').action(require('./actions/rollback'))

// 解析参数这一行要放到定义的命令最后面
program.parse(process.argv)
