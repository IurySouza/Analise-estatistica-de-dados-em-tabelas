const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))

const indexRouter = require('./routes/new')
const editRouter = require('./routes/edit')
const analiseRouter = require('./routes/estatistica')

app.use(indexRouter)
app.use('/editar', editRouter)
app.use('/analise', analiseRouter)

app.listen(port, () => console.log(`Ouvindo na porta ${port}`))