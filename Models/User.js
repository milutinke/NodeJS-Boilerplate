// Libraries
const { Sequelize, Model, DataTypes } = require('sequelize');
const BCrypt = require('bcrypt');
const Config = require('../Config');
const Logger = require('../Utils/Logger');
const SequelizePaginate = require('sequelize-paginate');

class User extends Model {
    // Instance methods
    get getFullName() {
        return [this.firstName, this.lastName].join(' ');
    }

    // Class methods
    static async hashUserPassword(user) {
        user.password = await BCrypt.hash(user.password, await BCrypt.genSalt(Config.BCrypt.HashingCost));
        return user;
    }

    static async login(user, password) {
        return await BCrypt.compare(password, user.password);
    }
}

const UserModel = User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    firstName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            is: {
                args: /^[aAbBcCčČćĆdDđĐeEfFgGhHiIjJkKlLmMnNoOpPqQrRsSšŠtTuUvVwWzZžŽxXyYаАбБвВгГдДеЕђЂёЁжЖзЗиИйЙjJкКлЛмМнНоОпПрРсСтТћЋуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/i,
                msg: '#LANG_FIRST_NAME_INVALID_CHARS'
            },

            fieldLength(value) {
                if (value.toString().length > 32)
                    throw new Error('#LANG_FIRST_NAME_LENGTH_TOO_LONG');
                else if (value.toString().length < 3)
                    throw new Error('#LANG_FIRST_NAME_LENGTH_TOO_SHORT');
            }
        }
    },

    lastName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            is: {
                args: /^[aAbBcCčČćĆdDđĐeEfFgGhHiIjJkKlLmMnNoOpPqQrRsSšŠtTuUvVwWzZžŽxXyYаАбБвВгГдДеЕђЂёЁжЖзЗиИйЙjJкКлЛмМнНоОпПрРсСтТћЋуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/i,
                msg: '#LANG_LAST_NAME_INVALID_CHARACTERS'
            },

            fieldLength(value) {
                if (value.toString().length > 32)
                    throw new Error('#LANG_LAST_NAME_LENGTH_TOO_LONG');
                else if (value.toString().length < 3)
                    throw new Error('#LANG_LAST_NAME_LENGTH_TOO_SHORT');
            }
        }
    },

    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: {
            args: true,
            msg: '#LANG_EMAIL_ALREADY_IN_USE'
        },
        validate: {
            isEmail: {
                msg: '#LANG_INVALID_EMAIL'
            }
        }
    },

    username: {
        type: DataTypes.STRING(20),
        unique: {
            args: true,
            msg: '#LANG_USERNAME_ALREADY_IN_USE'
        },
        allowNull: false,
        validate: {
            len: {
                args: [5, 20],
                msg: '#LANG_USERNAME_LENGTH'
            },
            is: {
                args: /^[aAbBcCčČćĆdDđĐeEfFgGhHiIjJkKlLmMnNoOpPqQrRsSšŠtTuUvVwWzZžŽxXyYаАбБвВгГдДеЕђЂёЁжЖзЗиИйЙjJкКлЛмМнНоОпПрРсСтТћЋуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/i,
                msg: '#LANG_USERNAME_INVALID_CHARACTERS'
            }
        }
    },

    password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            len: {
                fieldLength(value) {
                    if (value.toString().length < 5)
                        throw new Error('#LANG_PASSWORD_TOO_SHORT');
                }
            }
        }
    },

    country: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            is: {
                args: /^[aAbBcCčČćĆdDđĐeEfFgGhHiIjJkKlLmMnNoOpPqQrRsSšŠtTuUvVwWzZžŽxXyYаАбБвВгГдДеЕђЂёЁжЖзЗиИйЙjJкКлЛмМнНоОпПрРсСтТћЋуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/i,
                msg: '#LANG_COUNTRY_NAME_INVALID_CHARACTERS'
            },

            fieldLength(value) {
                if (value.toString().length > 32)
                    throw new Error('#LANG_COUNTRY_NAME_TOO_LONG');
            }
        }
    },

    banned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    pin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                args: true,
                msg: '#LANG_PIN_MUST_BE_AN_INTEGER'
            },

            isInValidRange(value) {
                const number = parseInt(value);
                if (number < 10000 || number > 99999)
                    throw new Error('#LANG_PIN_OUT_OF_RANGE');
            }
        }
    }
}, {
    sequelize: require('../DataBase'),
    modelName: 'User'
});

// Hash user password before storing/updating the user in the DB
User.beforeCreate(async (user, options) => {
    try {
        return await User.hashUserPassword(user);
    } catch (error) {
        Logger.error(`${error}`);
        throw new Error(error);
    }
});

User.beforeUpdate(async (user, options) => {
    try {
        return await User[hashUserPassword](user);
    } catch (error) {
        Logger.error(`${error}`);
        throw new Error(error);
    }
});

// Synchronise the table in the DB and the model
User.sync({ force: Config.DB.ForceDropAndRecreate });

// Enable pagination
SequelizePaginate.paginate(User);

// Export the model
module.exports = UserModel;