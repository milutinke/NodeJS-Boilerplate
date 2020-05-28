const UserService = require('../../Services/UserService');
const SessionService = require('../../Services/SessionService');

class UserContoller {
    static async register(req, res) {
        try {
            const { firstName, lastName, email, username, password, repeatPassword, country } = req.body;

            if (password !== repeatPassword)
                throw new Error('#LANG_PASSWORDS_DO_NOT_MATCH');

            // Create he user
            const user = await UserService.createUser(firstName, lastName, email, username, password, country);

            // Secure the user object for the response request
            UserService.secureUserObject(user);

            // Create a new session
            const session = await SessionService.createNewSession(user, req.useragent);
            res.status(201).json({ user, token: session.token });
        } catch (error) {
            res.status(400).json({ error: error.message });
            console.log(error);
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Check the fields
            if (!username)
                throw new Error('#LANG_PROVIDE_USERNAME');

            if (!password)
                throw new Error('#LANG_PROVIDE_PASSWORD');

            // Check if the uer exists
            const user = await UserService.findUser(username);

            if (!user)
                throw new Error('#LANG_USER_DOES_NOT_EXISTS');

            // Login the user
            const loginResult = await UserService.login(user, password);

            if (!loginResult)
                throw new Error('#LANG_INVALID_PASSWORD');

            // Secure the user object for the response request
            UserService.secureUserObject(user);

            // Create a new session
            const session = await SessionService.createNewSession(user, req.useragent);
            res.status(200).json({ user, token: session.token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async test(req, res) {
        res.status(200).json({ user: req.user, token: req.token });
    }
}

module.exports = UserContoller;