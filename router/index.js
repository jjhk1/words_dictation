const express = require('express')

const router = express.Router()

const router_handler = require('./router_handler/index.js')

router.get('/api/getaudio/:word', router_handler.getWordAudio)

module.exports = router
