const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))

const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')

router.get('/', (req, res) => {
    const rootPath = `${path.dirname(__dirname)}\\uploads\\data.json` 

    fs.readFile(rootPath, 'utf-8', async (err, data) => {
        if (err) {
            return console.log(err)
        }

        var d = await JSON.parse(data)
        res.render('edit', { data: d })
    })
})

router.get('/estatistica', (req, res) => {
    res.redirect('/analise')
})

router.post('/deletar', (req, res) => {
    res.redirect('/')
})

router.post('/atualizar', (req, res) => {
    const rootPath = `${path.dirname(__dirname)}\\uploads\\data.json`

    fs.readFile(rootPath, 'utf-8', async (err, data) => {
        if (err) {
            return console.log(err)
        }

        let d = JSON.parse(data)

        function atualizar(nrow, ncol, value) {
            if (nrow > 1) {
                d.cell[nrow - 2][ncol].value = value
            } else {
                d.keys[ncol] = value
            }
        }

        let i = 0
        for (i; i < d.nkeys; i++) {
            if (d.keys[i] == req.body.coluna) {
                console.log(d.keys[i])
                break
            }
        }

        atualizar(parseInt(req.body.linha), i, req.body.value)

        d = JSON.stringify(d)

        fs.writeFile('./uploads/data.json', d, err => {
            if (err) {
                return console.log('Ocorreu um erro ao salvar o arquivo de cabeçalho.')
            }
            console.log('O arquivo foi salvo.')
        })
    })
    
    res.redirect('back')
})

router.post('/baixar', (req, res) => {
    const rootPath = `${path.dirname(__dirname)}\\uploads\\data.json`

    fs.readFile(rootPath, 'utf-8', (err, data) => {
        if (err) {
            return res.send('Ocorreu um erro ao abrir o arquivo data.json. ' + err)
        }

        let aux = JSON.parse(data)
        let ndata = []
        const keys = aux.keys
        const nkeys = aux.nkeys

        for (let i in aux.cell) {
            ndata.push({})
            for (let j = 0; j < nkeys; j++) {
                ndata[i][keys[j]] = aux.cell[i][j].value
            }
        }

        let wb = xlsx.utils.book_new()
        wb.SheetNames.push(aux.workspace)
        wb.Sheets[aux.workspace] = xlsx.utils.json_to_sheet(ndata)

        const filename = `uploads/${aux.filename}`
        xlsx.writeFile(wb, filename)
        res.download(filename)
    })
})

module.exports = router