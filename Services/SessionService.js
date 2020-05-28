const Session = require('../Models/Session');
const JWTUtils = require('../Utils/JWT');
const Logger = require('../Utils/Logger');

/**
 * Session Service class
 * @class
 * @author Dusan Milutinovic
 */
class SessionService {
    /**
     * Generates a new Session for the given user
     * @param {User} User
     * @throws {Exception} If the JWT or the DB fail, it will throw an exception
     * @returns {Session} Newly created session
     */
    static async createNewSession(user, agent) {
        try {
            const token = await JWTUtils.Sign(user.id);
            const deviceType = agent.isMobile ? 'Mobile' : 'Desktop';

            return await Session.create({
                UserId: user.id,
                name: [deviceType, agent.os, agent.browser].join(' - '),
                deviceType,
                os: agent.os,
                browser: agent.browser,
                platform: agent.platform,
                token
            });
        } catch (error) {
            console.log(error);
            Logger.error(error);
            throw new Error(error);
        }

        return null;
    }

    /**
     * Checks if the user session exists in the DB
     * @param {User} User
     * @param {string} Token
     * @returns {boolean}
     */
    static async isValidSession(user, token) {
        return await Session.findOne({ where: { token, UserId: user.id } });
    }

    /**
     * Deleted the requested session
     * @param {integer} Session ID 
     * @returns {void}
     */
    static async deleteSession(id) {
        await Session.destroy({ where: { id } });
    }
}

/**
 * Sesssion Service module
 * @module Services/SessionService
 */
module.exports = SessionService;