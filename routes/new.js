const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})
const upload = multer({ storage }).any('table')

const fs = require('fs')
const xlsx = require('xlsx')
const path = require('path')

/********** Roteamento **********/

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/nova-tabela', (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.send('Ocorreu um erro ao salvar a tabela, tente novamente.')
        }

        if (req.body.filename !== undefined) {
            const rootPath = path.dirname(__dirname)
            const workspace = req.body.workspace

            let wb = xlsx.readFile(`${rootPath}/uploads/${req.body.filename}`, { cellDates: true })
            wb = wb.Sheets[workspace]

            const tableToJson = xlsx.utils.sheet_to_json(wb, {
                header: 0,
                defval: ""
            })

            const auxTable = tableToJson
            JSON.stringify(auxTable)

            let keys = Object.keys(auxTable[0]), nkeys = keys.length, nrows = auxTable.length
            let data = { filename: req.body.filename, workspace: req.body.workspace, keys: [], nkeys, nrows, cell: [] }

            const aux = {
                sum: [],
                ntotal: [],
                nums: []
            }

            for (let i = 0; i < nkeys; i++) {
                data.keys.push({ value: keys[i] })
                aux.sum.push(0)
                aux.ntotal.push(0)
                aux.nums.push(0)
            }

            for (let i = 0; i < nrows; i++) {
                for (j = 0; j < nkeys; j++) {
                    const value = auxTable[i][keys[j]]
                    const type = typeof (value)

                    if (j == 0) {
                        data.cell.push([{ value, type }])
                    } else {
                        data.cell[i].push({ value, type })
                    }
                    if (type == 'number' || value == '') {
                        aux.nums[j]++
                        aux.sum[j] += value * 1
                    }
                    aux.ntotal[j]++
                }
            }

            for (let i = 0; i < nkeys; i++) {
                if (!(aux.ntotal[i] - aux.nums[i])) {
                    data.keys[i].allNums = true
                } else {
                    data.keys[i].allNums = false
                }
                data.keys[i].nelems = aux.ntotal[i]
                data.keys[i].sum = aux.sum[i]
                data.keys[i].media = 0
            }

            data = JSON.stringify(data)

            fs.writeFile(`${rootPath}/uploads/data.json`, data, err => {
                if (err) {
                    return console.log('Ocorreu um erro ao salvar o arquivo de cabeçalho.')
                }
                console.log('O arquivo de cabeçalho foi salvo.')
            })
        }
    })

    res.redirect('/editar')
})

module.exports = router