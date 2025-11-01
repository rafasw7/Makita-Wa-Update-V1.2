#!/bin/bash

clear

node -e "
const figlet = require('figlet')
const CYAN = '\x1b[36m'
const RESET = '\x1b[0m'

figlet('MAKITA', { font: 'Big' }, (err, data) => {
    if (err) {
        console.error('\x1b[31mErro:\x1b[0m', err)
        process.exit(1)
    }
    console.log(CYAN + data + RESET)
})
"

sleep 1

node conexao.js