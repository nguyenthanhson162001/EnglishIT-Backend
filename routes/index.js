const site = require('./site')
const unit = require('./unit')
const user = require('./user')
const exam = require('./exam')
const typeVocabulary = require('./typeVocabulary')
const tokenUser = require('..//util/tokenUser')
const checMiddleware = require('..//app/middlewarses/checkUserMiddlewarse')

function router(app) {

    app.use('/api/unit', unit)
    app.use('/api/exam', exam)
    app.use('/api/typevocabulary', typeVocabulary)
    app.use('/user', checMiddleware, user)
    app.get("/login", (req, res) => {
        res.oidc.login();
    });
    app.get("/logout", (req, res) => {
        req.oidc.logout();
    });
    app.use('/api', site)
    app.get('/*', (req, res) => {
        res.send('Hello this is server EnglishIT' + req.a);
    })

}
module.exports = router;