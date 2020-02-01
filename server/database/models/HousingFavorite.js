
module.exports = (sequelize, DataTypes) => {

    const HousingFavorite = sequelize.define('housing_favorite', {

    }, {
        createdAt: false,
        updatedAt: false
    })

    return HousingFavorite
}