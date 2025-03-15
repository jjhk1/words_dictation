const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()

// 挂载解析req.body的json数据内置中间件
app.use(express.json())
app.use(express.static('./'))
app.use(cors())
// 挂载解析URL-encoded内置中间件
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, './index.html'), 'utf8', (err, result) => {
    if (err) return err
    res.end(result)
  })
})

const router = express.Router()

const router_handler = require('./router_handler/index.js')

app.get('/api/getaudio/:word', router_handler.getWordAudio)

app.listen(80)
