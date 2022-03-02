const createOrUpdateUser = require('..//..//util/createOrUpdateUser')
module.exports = async function (req, res, next) {
    if (req.oidc.isAuthenticated()) {
        const [user, created] = await createOrUpdateUser(req.oidc.user);
        req.userID = user.id;
        next()
        if (created) {
            console.log('tao moi user');
        }
    }
    else {
        console.log('Require logger')
        res.status(401).json({ message: 'Require logger' })
        return;
    }
}