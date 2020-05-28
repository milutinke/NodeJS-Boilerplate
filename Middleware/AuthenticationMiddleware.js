const JWTUtils = require('../Utils/JWT');
const UserService = require('../Services/UserService');
const SessionService = require('../Services/SessionService');

/**
 * Authentication Middleware Class
 * @class
 * @author Dusan Milutinovic
 */
class AuthenticationMiddleware {
    /**
     * Handles incomming request and implements the authentication logic
     * @param {Express Request Object} req 
     * @param {Express Response Object} res 
     * @param {Express next Object} next 
     * @returns {void}
     */
    static async handle(req, res, next) {
        try {
            const header = req.header('Authorization');

            // Check if we have the Authorisation field in the request header
            if (header !== undefined) {
                // Get the token itself
                const token = (header.split(' ')[1]).trim();

                if (!token)
                    throw new Error('#LANG_INVALID_TOKEN');

                // Verify the token
                const decoded = await JWTUtils.Verify(token);

                // Check if the token is not a valid one
                if (!decoded || !decoded.id)
                    throw new Error('#LANG_FAILED_TO_DECODE');

                // Chek if the token is purposed for this user
                const user = await UserService.findUser(decoded.id);

                if (!user)
                    throw new Error('#LANG_INVALID_USER');

                // Check if the session is invalid or if it has expired
                const isValidSession = await SessionService.isValidSession(user, token);

                if (!isValidSession)
                    throw new Error('#LANG_SESSION_DOES_NOT_EXISTS');

                // Store user and token on the request body for feature use
                req.user = user;
                req.token = token;

                next();
            } else throw new Error('#LANG_POVIDE_THE_TOKEN');
        } catch (error) {
            res.status(401).json({ error });
        }
    }
}

/**
 * Authentication Middleware module
 * @module Middleware/AuthenticationMiddleware
 */
module.exports = AuthenticationMiddleware;