// Libraries
const Sequelize = require('sequelize');
const Config = require('../Config');
const Logger = require('../Utils/Logger');

// Connection CLass
class Connection {
    constructor() {
        // Establish the Connection
        this.establish();

        // Authenticate
        this.auth();
    }

    establish() {
        this.connection = new Sequelize(Config.DB.DataBase, Config.DB.User, Config.DB.Password, {
            host: Config.DB.Host,
            port: Config.DB.Port,
            dialect: Config.DB.Dialect,

            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    }

    auth() {
        this.connection.authenticate()
            .then(() => Logger.info('Data Base Connection Successfully Established'))
            .catch(error => {
                Logger.fatal(`Failed to connect to the Data Base: ${error}`);
                process.exit(0);
            });
    }

    getConnection() {
        return this.connection;
    }
}

// Module Exports
module.exports = new Connection().getConnection();