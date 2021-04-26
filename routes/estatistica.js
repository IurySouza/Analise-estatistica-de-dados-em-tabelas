const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

router.get('/', (req, res) => {
    // const python = spawn('python', ['scripts\\analise.py'])
    // let result = ''
    // python.stdout.on('data', function(data) {
    //     result += data.toString('latin1')
    // })
    // python.on('close', function(code) {
    //     console.log('Resultado: ' + result)
    // }) 

    const python = spawn('python', ['scripts\\analise.py'])
    var dataToSend
    python.stdout.on('data', function (data) {
        dataToSend = data.toString('latin1')
    })
    python.on('close', code => {
        console.log(dataToSend)
        res.render('analise')
    })
})

module.exports = router