const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const multer = require('multer')
const upload = multer({ dest: 'public/unit/images' })

const checkUSer = require('../app/middlewarses/checkUserMiddlewarse')

const Vocabulary = require('../app/model/vocabulary')
const unitController = require('../app/controller/UnitController')

router.get('/getunits', unitController.getUnits)
router.get('/checknameunit', unitController.checkNameUnit)
router.post('/create', upload.single('image'), unitController.createUnit)
router.put('/update', checkUSer, upload.single('image'), unitController.updateUnit)
module.exports = router;