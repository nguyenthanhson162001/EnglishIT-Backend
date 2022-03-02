
const User = require('..//app/model/user')
module.exports = async function createOrUpdateUser(data) {
    return User.findOrCreate({
        where: { codeSupplied: data.sub.split('|')[1] },
        defaults: {
            provide: data.sub.split('|')[0],
            lastName: data.family_name || '',
            avatarURL: data.picture,
            firstName: data.given_name || '',
            email: data.email
        }
    });
}