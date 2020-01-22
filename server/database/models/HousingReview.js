
module.exports = (sequelize, DataTypes) => {

    const HousingReview = sequelize.define('housing_review', {

        score_checkin: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        score_accuracy: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        score_location: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        score_communication: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        score_cleanliness: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        score_value: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    }, {
        createdAt: "posted_at",
        updatedAt: false,
    })

    return HousingReview
}