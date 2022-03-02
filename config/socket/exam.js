const axios = require('axios');
const ExamControl = require('../../util/ExamControl')
const { Sequelize, Op } = require('sequelize');
const Exam = require('..//..//app/model/exam')
const { User, Unit, Process, Vocabulary, TypeVocabulary } = require('..//..//app/model')
const createOrUpdateUser = require('..//..//util/createOrUpdateUser')
const { getUserIDWithAuthToken, getAuthToken } = require('../../util/tokenUser')

function exam(io) {


    io.on('connection', (client) => {
        client.userID;
        client.on('authenticate', function (data) {
            // check data được send tới client
            const dataToken = getUserIDWithAuthToken(data.token);
            if (dataToken) {
                client.userID = dataToken.id;
                client.emit('authenticate', { status: true })
            }
        });

        setTimeout(function () {
            //sau 1s mà client vẫn chưa dc auth, lúc đấy chúng ta mới disconnect.
            if (!client.userID) {
                client.emit('unAuthenticated', ({ message: 'Authenticate fail' }));
                client.disconnect('unauthorized');
            }
        }, 2000);
        console.log('===> Start connection with clientID: ' + client.id);
        var examControl;
        let sumTotalQuestion = 0;
        client.on('start-client', async function (data) {

            const { unitSlug, processSlug } = data
            const userID = ''

            const [user, unit, process] = await Promise.all([
                User.findOne({ where: { id: client.userID } }),
                Unit.findOne({ where: { slug: unitSlug } }),
                Process.findOne({ where: { slug: processSlug } })
            ])
            console.log(user)
            if (!user || !unit || !process) {
                client.emit('error', {
                    message: 'user or unti or process incorrect'
                })
                return
            }
            examControl = new ExamControl(
                await Vocabulary.findAll({
                    where: { unit_id: unit.id },
                    include: { model: TypeVocabulary },
                }),
                unit.id,
                process.id,
                user.id)
            sumTotalQuestion = examControl.length()
            if (sumTotalQuestion == 0) {
                client.emit('error', {
                    message: 'Unit haven\'t vocabulary'
                })
            }
            // client show form exam
            client.emit('start-server', { unitName: unit.name, processName: process.name, sumTotalQuestion: sumTotalQuestion })
        });

        client.on('get-question', () => {
            sendQuestion()
        });
        client.on('check-answer', (answer) => {
            client.emit('server-result-check-answer', { result: examControl.isAnswer(answer) })
        });

        async function sendQuestion() {
            if (!examControl.isFinish()) {
                client.emit('server-send-question', await examControl.getQuestion())
            } else {
                client.emit('server-finish', examControl.getIncorrectVocabularies())
            }
        }
        client.on('disconnect', () => { console.log('!=!=> disconnect: ' + client.id) });
    });
}
module.exports = exam;
