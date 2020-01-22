
module.exports = (sequelize, DataTypes) => {

    const HousingImage = sequelize.define('housing_image', {

        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return HousingImage
}