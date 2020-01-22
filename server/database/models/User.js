
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        user_role: {
            type: DataTypes.ENUM("guest", "host"),
            allowNull: false,
        }

    }, {
        createdAt: false,
        updatedAt: false,
        indexex: [
            {
                unique: true,
                fields: ["email"]
            }
        ]
    })

    return User
}