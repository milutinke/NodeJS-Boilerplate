// Libraries
const User = require('../Models/User');

/**
 * User Service class
 * @class
 * @author Dusan Milutinovic
 */
class UserService {
    /**
     * Creates a new user
     * @param {string} firstName - First Name
     * @param {string} lastName - Last Name
     * @param {string} email - Email
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {string} city - City
     * @param {string} birthday - Birthday
     * @param {boolean} graduate - Is the user a graduate
     * @throws May throw an exception if the data base fails
     * @returns {User}
     */
    static async createUser(firstName, lastName, email, username, password, country) {
        return await User.create({ firstName, lastName, email, username, password, country });
    }

    /**
     * Returns all users from the data base
     * @throws May throw an exception if the data base fails
     * @returns {User[]}
     */
    static async getAll() {
        return await User.findAll();
    }

    /**
     * Returns the paginated result for the users
     * @param {Object} options - Options object
     * @see {@link https://www.npmjs.com/package/sequelize-paginate|NPM Sequielize Paginate}
     * @returns {Object}
     */
    static async paginate(options) {
        return await User.paginate(options);
    }

    /**
     * Returns a number of the users in the database
     * @throws May throw an exception if the data base fails
     * @returns {number}
     */
    static async getNumber() {
        return await User.count();
    }

    /**
     * Finds user by id or the username
     * @param {(number|string)} indentificator - Indetificator of the user (id or username)
     * @throws Will throw an error if the argument is null, undefined, not a number or not a string.
     * @returns {User}
     */
    static async findUser(indentificator) {
        if (!indentificator)
            throw new Error("#LANG_INDENTIFICATOR_IS_INVALID");

        const isNumber = typeof indentificator === 'number';
        const isString = typeof indentificator === 'string';

        if (isNumber && indentificator === Number.NaN)
            throw new Error("#LANG_INDENTIFICATOR_IS_NAN");

        if (!isNumber && !isString)
            throw new Error("#LANG_INDENTIFICATOR_UNSUPORTED_TYPE");

        return await (isNumber ? UserService.getById(indentificator)
            : indentificator.indexOf(' ') === -1 ? UserService.getByUsername(indentificator) : UserService.getByFullName(indentificator));
    }

    /**
     * Finds user by id
     * @param {number} id - User id
     * @throws May throw an exception if the data base fails
     * @returns {User}
     */
    static async getById(id) {
        return await User.findByPk(id);
    }

    /**
     * Finds user by username
     * @param {string} username - Username
     * @throws May throw an exception if the data base fails
     * @returns {User}
     */
    static async getByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    /**
     * Finds user by full nane
     * @param {string} name - Full Name
     * @throws May throw an exception if the data base fails
     * @returns {User}
     */
    static async getByFullName(name) {
        if (!name || name.lenght === 0)
            throw new Error('#LANG_EMPTY_NAME');

        const [firstName, lastName] = name.split(' ');
        return await User.findOne({ where: { firstName, lastName } });
    }

    /**
     * Validates user credentials
     * @param {User} user - User
     * @param {string} user - Password
     * @throws May throw an exception if the data base fails
     * @returns {boolean}
     */
    static async login(user, password) {
        return await User.login(user, password);
    }

    /**
     * Removes password and pin from user object for security reasons
     * @param {User} user - User
     * @throws May throw an exception if the data base fails
     * @returns {void}
     */
    static secureUserObject(user) {
        user.password = undefined;
        user.pin = undefined;
    }
}

/**
 * User Service module
 * @module Services/UserService
 */
module.exports = UserService;