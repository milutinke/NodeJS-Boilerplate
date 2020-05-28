const JWT = require('jsonwebtoken');
const Configs = require('../Config');
const Logger = require('./Logger');

class JWTUtils {
    /**
     * Aync JWT Sign function which signs the token
     * @param {integer} User ID
     * @returns {void} 
     */
    static async Sign(userid) {
        return new Promise((resolve, reject) => {
            JWT.sign({ id: userid }, Configs.JWT.Secret, { algorithm: Configs.JWT.Algorithm, expiresIn: Configs.JWT.Expiration }, function (error, token) {
                if (error) {
                    Logger.error(`JWT Error: ${error}`);
                    reject(`#LANG_JWT_ERROR -> {${error}}`);
                } else resolve(token);
            });
        });
    }

    /**
     * Aync JWT Verify function which verifies the token
     * @param {string} Token
     * @returns {void}
     */
    static async Verify(token) {
        return new Promise((resolve, reject) => {
            JWT.verify(token, Configs.JWT.Secret, (error, decoded) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        reject(`#LANG_SESSION_EXPIRED`);
                    } else reject(`#LANG_JWT_ERROR -> {${error}}`);
                } else resolve(decoded);
            });
        });
    }
}

module.exports = JWTUtils;