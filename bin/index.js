#!/usr/bin/env node

const { program } = require('commander')
const packageJson = require('../package.json')

// version
program.version(packageJson.version, '-v, --version')

program.parse(process.argv)
