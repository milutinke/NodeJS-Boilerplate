// Libraries
const { Sequelize, Model, DataTypes } = require('sequelize');
const User = require('./User');
const Config = require('../Config');

class Session extends Model { }

const SessionModel = Session.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    name: {
        type: DataTypes.STRING(64),
        defaultValue: 'None'
    },

    deviceType: {
        type: DataTypes.STRING(32),
        defaultValue: 'Unknown'
    },

    os: {
        type: DataTypes.STRING(32),
        defaultValue: 'Unknown'
    },

    browser: {
        type: DataTypes.STRING(32),
        defaultValue: 'Unknown'
    },

    platform: {
        type: DataTypes.STRING(32),
        defaultValue: 'Unknown'
    },

    token: {
        type: DataTypes.STRING(256),
        allowNull: false
    }
}, {
    sequelize: require('../DataBase'),
    modelName: 'Session'
});

// Associate token with the User
Session.belongsTo(User, {
    onDelete: 'cascade'
});

// Synchronise the table in the DB and the model
Session.sync({ force: Config.DB.ForceDropAndRecreate });

// Export the model
module.exports = SessionModel;