const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')

router.get('/', (req, res) => {
    res.send('chegou python')
   /* const python = spawn('python', ["./analise.py"])
    var dataToSend
    python.stdout.on('data', function(data) {
       res.send(data.toString())
    }) */
})

module.exports = router