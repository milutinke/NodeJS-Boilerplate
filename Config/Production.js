const Config = {
    // Data Base
    DB: {
        // Data Base name
        DataBase: process.env.DB || 'boilerplate-project',

        // Data Base user name
        User: process.env.DB_USER || 'root',

        // Data Base user password
        Password: process.env.DB_PASSWORD || 'root',

        // Data Base ip address or domain
        Host: process.env.FB_HOST || 'localhost',

        // Data Base port
        Port: process.env.DB_PORT || 3306,

        // Data Base dialect
        Dialect: process.env.DB_DIALECT || 'mysql',

        // Recreate tables on each synchonisation
        ForceDropAndRecreate: false
    },

    // JWT Config
    JWT: {
        Secret: process.env.JWT_SECRET || 'mysecret',
        Algorithm: process.env.JWT_ALGORITHM || 'HS256',
        Expiration: process.env.JWT_EXPIRATION || 300 // In seconds
    },

    // BCrypt Config
    BCrypt: {
        HashingCost: process.env.BCRYPT_HASHING_COST || 10
    },

    // Logging
    Logging: {
        // Is Logging enabled
        Enabled: true,

        // Logging levels
        Levels: ['info', 'error', 'warn', 'fatal'],

        // Logging directory
        Directory: 'Logs',

        // Logging file name format
        FileFormat: 'LOG-<DATE>.txt',

        // Logging date format
        DateFormat: 'DD.MM.YYYY',

        // Timestamp format
        TimeStampFormat: 'HH:mm:ss.SSS'
    },

    // Express
    Express: {
        Port: process.env.PORT || 3000
    }
};

// Module Exports
module.exports = Config;