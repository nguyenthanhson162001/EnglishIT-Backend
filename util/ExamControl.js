const { Sequelize, Op } = require('sequelize');
const Exam = require('../app/model/exam')
const { User, Unit, Process, Vocabulary, TypeVocabulary } = require('..//app/model')
class ExamControl {
    constructor(vocabularies, unitID, processID, userID) {
        if (!vocabularies) {
            vocabularies = [];
        }
        this.vocabularies = vocabularies.sort(() => Math.random() - 0.5);
        this.vocabulariesIncorrect = [];
        this.indexQuestion = 0;
        this.processID = processID;
        this.unitID = unitID;
        this.userID = userID;
        this.incorrectVocabularies = [];
        this.sumTotalQuestion = vocabularies.length
        this.startTime = new Date();
    }
    async getQuestion() {
        // 1 is English - vietnamese

        if (this.processID == 1) {
            return await this.getQuestionEnglish_Vietnamese()
        }
        // 2 is Vietnamese - English
        return await this.getQuestionVietnamese_English()

    }
    async getQuestionEnglish_Vietnamese() {
        let random = Math.floor(Math.random() * this.vocabularies.length)

            // duplicate index answer 
        while (random == this.indexQuestion) { random = Math.floor(Math.random() * this.vocabularies.length) }

        // get 1 answer in unit
        let option = [this.vocabularies[this.indexQuestion].vietnamese, this.vocabularies[random].vietnamese]
            // get 2 answer all unit
        let optionOrder = await Vocabulary.findAll({
            where: {
                vietnamese: {
                    [Op.notIn]: option
                }
            },
            order: Sequelize.literal('rand()'),
            limit: 2,
            attributes: ['vietnamese']
        })
        optionOrder.forEach(element => {
            option.push(element.vietnamese)
        });
        option.sort(() => Math.random() - 0.5)
        return {
            index: this.indexQuestion,
            english: this.vocabularies[this.indexQuestion].english,
            spelling: this.vocabularies[this.indexQuestion].spelling,
            type: this.vocabularies[this.indexQuestion].typeVocabulary.NameEnglish,
            option: option,
        }
    }
    async getQuestionVietnamese_English() {
        let random = Math.floor(Math.random() * this.vocabularies.length)
            // duplicate index answer 
        while (random == this.indexQuestion) { random = Math.floor(Math.random() * this.vocabularies.length) }
        // get 1 answer in unit
        let option = [this.vocabularies[this.indexQuestion].english, this.vocabularies[random].english]
            // get 2 answer all unit
        let optionOrder = await Vocabulary.findAll({
            where: {
                english: {
                    [Op.notIn]: option
                }
            },
            order: Sequelize.literal('rand()'),
            limit: 2,
            attributes: ['english']
        })
        optionOrder.forEach(element => {
            option.push(element.english)
        });
        option.sort(() => Math.random() - 0.5)
        return {
            index: this.indexQuestion,
            english: this.vocabularies[this.indexQuestion].vietnamese,
            spelling: '',
            type: this.vocabularies[this.indexQuestion].typeVocabulary.NameEnglish,
            option: option,
        }
    }
    getIndexQuestionNow() {
        return this.indexQuestion
    }
    getAllQuestion() {
        return this.vocabularies
    }
    length() {
        return this.vocabularies.length;
    }
    printAllQuestion() {
        // console.log(this.userID, this.processID, this.unitID);
        let result = this.vocabularies.map(vocabulary => {
            return {
                English: vocabulary.english,
                VietName: vocabulary.vietnamese
            }
        });
        // console.table(result);
    }
    isFinish() {
        // console.log(this.indexQuestion, this.sumTotalQuestion)
        if (this.indexQuestion >= this.sumTotalQuestion) {
            this.save()
            return true;
        }
        return false;
    }
    isAnswer(answer) {
        if (this.isFinish()) {
            throw Error('finished exam');
        }
        if (this.processID == 1) {
            if (answer.trim() == this.vocabularies[this.indexQuestion].vietnamese.trim()) {
                this.indexQuestion++;
                return true
            }
        } else {
            if (answer.trim() == this.vocabularies[this.indexQuestion].english.trim()) {
                this.indexQuestion++;
                return true
            }
        }
        // incorrect // check not replate
        if (this.incorrectVocabularies[this.incorrectVocabularies.length - 1] != this.vocabularies[this.indexQuestion]) {
            this.incorrectVocabularies.push(this.vocabularies[this.indexQuestion]);
        }
        return false
    }

    getIncorrectVocabularies() {
        return this.incorrectVocabularies
    }
    async save() {
        let percentComplete = (this.sumTotalQuestion - this.incorrectVocabularies.length) * (100.0 / this.sumTotalQuestion)
        var exam = await Exam.findOne({
            where: {
                user_id: this.userID,
                unit_id: this.unitID,
                process_id: this.processID
            }
        })
        if (exam) {
            Exam.update({
                percentComplete,
                timer: (new Date().getTime() - this.startTime) / 1000
            }, { where: { id: exam.id } })
        } else {
            Exam.create({
                percentComplete,
                timer: (new Date().getTime() - this.startTime) / 1000,
                user_id: this.userID,
                unit_id: this.unitID,
                process_id: this.processID
            })
        }
    }
}
module.exports = ExamControl