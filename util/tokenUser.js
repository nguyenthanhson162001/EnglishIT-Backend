const jwt = require('jsonwebtoken')
module.exports = {
    getUserIDWithAuthToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);

    },
    getAuthToken(userID) {
        return jwt.sign({ id: userID }, process.env.JWT_SECRET);
    }
}
