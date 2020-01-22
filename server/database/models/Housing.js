
module.exports = (sequelize, DataTypes) => {

    const Housing = sequelize.define('housing', {

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        info_guest: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        info_kitchen: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        info_bed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        info_wifi: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }

    }, {
        createdAt: false,
        updatedAt: false,
    })

    return Housing
}