const express = require('express');
const router = express.Router();
const checkUSer = require('../app/middlewarses/checkUserMiddlewarse')
const siteController = require('../app/controller/SiteController')

// const User = require('../app/model/user')
// const jwt = require('jsonwebtoken')
// const checkJwt = require('../app/middlewarses/auth0Middlewares')
// const Unit = require('../app/model/unit')
// const TypeVocabulary = require('..//app/model/typeVocabulary')
const vocabulary = require('../app/model/vocabulary')
// const process = require('../app/model/process')
// const exam = require('../app/model/exam')
// '1', 'Verb', 'Động từ', 'v'
// '2', 'Adverb', 'Trạng từ', 'adv'
// '3', 'Adjective', 'Tính từ', 'adj'
// '4', 'Nouns', 'Danh từ', 'n'
// '5', 'Prepositions', 'Giới từ', 'pre'

router.get('/auth0/config', siteController.config)

module.exports = router;