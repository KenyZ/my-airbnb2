
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


    User.login = async (email, password) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        let user = null
        let auth = false

        try {
            user = await User.findOne({
                attributes: ["id", "password"],
                where: {
                    email: email
                }
            })

            if(user){
                if(user.password === password){
                    auth = true
                    results.data = {
                        id: user.get("id"),
                    }
                }
            }

            if(!auth){
                results.error = {
                    message: "NOT FOUND - user not found",
                    name: "user_not_found"
                }
                results.status = 404
            }

        } catch (ErrorLoginUser) {
            results.error = {
                message: "BAD GATEWAY - error on login user"
            }
            results.status = 502
        }

        return results
    }

    return User
}