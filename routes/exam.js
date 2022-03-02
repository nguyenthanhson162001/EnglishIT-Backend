const express = require('express');
const router = express.Router();
const User = require('../app/model/user')
const jwt = require('jsonwebtoken')
const checkJwt = require('../app/middlewarses/auth0Middlewares')
const Unit = require('../app/model/unit')
const TypeVocabulary = require('..//app/model/typeVocabulary')
const vocabulary = require('../app/model/vocabulary')
const process = require('../app/model/process')
const Exam = require('../app/model/exam')
const checkUSer = require('../app/middlewarses/checkUserMiddlewarse')

router.get('/getexam', checkUSer, async (req, res) => {
    const exam = await Exam.findAll({ where: { user_id: req.userID } });
    res.status(200).json({ exam })
})
module.exports = router;