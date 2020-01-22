
module.exports = (sequelize, DataTypes) => {

    const Booking = sequelize.define('booking', {

        checkin: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        checkout: {
            type: DataTypes.DATE,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false,
    })

    return Booking
}