const UserController = require('../../Controllers/User');
const AuthenticationMiddleware = require('../../Middleware/AuthenticationMiddleware');

module.exports = App => {
    // Register the user
    App.post(
        // Route
        '/user/register',

        // Controller
        async (req, res) => await UserController.register(req, res)
    );

    // Authenticate the user
    App.post(
        // Route
        '/user/login',

        // Controller
        async (req, res) => await UserController.login(req, res)
    );

    // Test
    App.post(
        // Route
        '/user/test',

        // Middleware
        async (req, res, next) => await AuthenticationMiddleware.handle(req, res, next),

        // Controller
        async (req, res) => await UserController.test(req, res)
    );
};