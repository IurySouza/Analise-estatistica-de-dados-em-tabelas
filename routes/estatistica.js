const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')
const fs = require('fs')
const est = require('simple-statistics')

router.get('/', (req, res) => {
    // const python = spawn('python', ['scripts\\analise.py'])
    // var dataToSend
    // python.stdout.on('data', function (data) {
    //     dataToSend = data.toString('latin1')
    // })
    // python.on('close', code => {
    //     console.log(dataToSend)
    //     res.render('analise')
    // })

    fs.readFile('uploads\\data.json', 'utf-8', async (err, data) => {
        if (err) {
            return console.log(err)
        }

        let d = await JSON.parse(data)
        let values = []
        let labels = []

        for (const i in d.keys) {
            if(d.keys[i].allNums) {
                const media = d.keys[i].sum/d.keys[i].nelems
                d.keys[i].media = media
                // dataToSend.push(d.keys[i])
                values.push(media)
                labels.push(d.keys[i].value)
            }
        }

        const dataToSend = { values, labels }

        res.render('analise.ejs', { data: dataToSend })
    })
})

module.exports = router