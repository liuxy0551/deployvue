#!/usr/bin/env node

const { program } = require('commander')
const packageJson = require('../package.json')

// version
program.version(packageJson.version, '-V, --version')
// build
program.command('build').description('build code').option('-e, --env <env>', 'environment', '').action(require('./actions/build'))
// deploy
program.command('deploy').description('deploy project').option('-e, --env <env>', 'environment', '').action(require('./actions/deploy'))

// 解析参数这一行要放到定义的命令最后面
program.parse(process.argv)
