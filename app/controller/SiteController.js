class SiteController {
    //[GET] /auth0/config
    config(req, res) {
        // let url = req.protocol + '://' + req.get('host') + req.originalUrl
        let url = req.protocol + '://' + req.get('host');
        res.json({
            "domain": process.env.AUTH0_DOMAIN,
            "clientId": process.env.AUTH0_CLIENT_ID,

        })
    }

}
module.exports = new SiteController;