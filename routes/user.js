const express = require('express');
const router = express.Router();
const { getAuthToken, getUserIDWithAuthToken } = require('../util/tokenUser')


router.get('/me', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const user = req.oidc.user
        res.json({ status: true, nickname: user.nickname, picture: user.picture })
    } else {
        res.json({ status: false, nickname: null, picture: null })
    }
});
router.get('/gettoken', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const token = getAuthToken(req.userID)
        console.log(getUserIDWithAuthToken(token))
        res.json({ status: true, token })
    } else {
        res.json({ status: false, token: null })
    }
});

module.exports = router;