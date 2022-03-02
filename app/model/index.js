const User = require('./user')
const Unit = require('./unit')
const Process = require('./process')
const Vocabulary = require('./vocabulary')
const Exam = require('./exam')
const TypeVocabulary = require('./typeVocabulary')
Vocabulary.belongsTo(TypeVocabulary, { foreignKey: 'typeVocabulary_id' });
TypeVocabulary.hasMany(Vocabulary, { foreignKey: 'typeVocabulary_id' })
module.exports = {
    User,
    Unit,
    Process,
    Vocabulary,
    Exam,
    TypeVocabulary
}