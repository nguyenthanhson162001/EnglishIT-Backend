const Unit = require('../model/unit')
const fs = require('fs')
class UnitController {
    // [GET] unit/getunits
    getUnits(req, res) {
        Unit.findAll().then(function (units) {
            res.status(200).json({ units })
        })
    }
    // [GET] /unit/checknameunit
    checkNameUnit(req, res) {
        let name = req.query.name
        if (name) {
            Unit.findOne({ where: { name: req.query.name } }).then((unit) => {
                if (unit) {
                    res.status(200).json({ exist: true })
                    return
                }
                res.status(200).json({ exist: false })
            })
        }
    }
    // [post] /unit/checknameunit
    async createUnit(req, res) {
        console.log(req.file)
        deleteImageUnit()
        const { vocabularies, unitName, UnitDescriptoin } = req.body
        if (!unitName || !vocabularies || vocabularies.length < 5) {
            res.status(200).json({ status: false, error: 'Require unit name and quantity vocabularies > 5' })
            return
        }
        const unit = await Unit.create({
            name: unitName,
            backgroudImage: req.file.filename,
            description: UnitDescriptoin,
            subscriber: 0
        })
        var vocabulariesInsert = vocabularies.map((e => {
            return {
                english: e.english,
                vietnamese: e.vietnamese,
                spelling: e.spelling,
                unit_id: unit.id,
                typeVocabulary_id: e.typeVocabulary_id,
            }
        }))
        console.log(vocabulariesInsert)
        // let insertResult = Vocabulary.bulkCreate(vocabulariesInsert)
        res.status(200).json({ status: true })
    }
    // [put] /unit/update
    async updateUnit(req, res) {
        const { vocabularies, unitName, UnitDescriptoin } = req.body
        if (!unitName || !vocabularies || vocabularies.length == 0) {
            res.status(200).json({ status: true, message: 'Require unit name and vocabularies > 0' })
            return
        }
        const unitCheck = await Unit.findOne({ where: { name: unitName } })
        if (unitCheck) {
            res.status(300).json({ status: false })
            return
        }
        const unit = await Unit.create({
            name: unitName,
            backgroudImage: 'EnglishIT1.jpg',
            description: UnitDescriptoin,
            subscriber: 0
        })
        var vocabulariesInsert = vocabularies.map((e => {
            return {
                english: e.english,
                vietnamese: e.vietnamese,
                spelling: e.spelling,
                unit_id: unit.id,
                typeVocabulary_id: e.typeVocabulary_id
            }
        }))
        let insertResult = Vocabulary.bulkCreate(vocabulariesInsert)

        res.status(200).json({ status: true })
    }
}
function deleteImageUnit(imageName) {
    try {
        fs.unlink('public/unit/images/' + imageName, () => {
            return true;
        })
    } catch (e) {
        console.log(e)
        return false
    }
}
module.exports = new UnitController;