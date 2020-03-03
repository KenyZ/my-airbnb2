
/**
 * SEQUELIZE
 */
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  
  process.env.DB_NAME, 

  process.env.DB_USER, 

  process.env.DB_PASSWORD, 

  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  } 
)

/**
 * MODELS
 */
const User = sequelize.import('./models/User.js')
      Housing = sequelize.import('./models/Housing.js'),
      HousingImage = sequelize.import('./models/HousingImage.js'),
      HousingReview = sequelize.import('./models/HousingReview.js'),
      Booking = sequelize.import('./models/Booking.js'),

// Housing's images
Housing.hasMany(HousingImage, {as: "images", foreignKey: "housing_id"})
HousingImage.belongsTo(Housing, {as: "images", foreignKey: "housing_id"})

// Housing's review
Housing.hasMany(HousingReview, {as: "reviews", foreignKey: "housing_id"})
HousingReview.belongsTo(Housing, {as: "reviews", foreignKey: "housing_id"})

// Reviews's author
User.hasOne(HousingReview, {as: "author", foreignKey: "author_id"})
HousingReview.belongsTo(User, {as: "author", foreignKey: "author_id"})

// Hosts's housings
User.hasMany(Housing, {as: "housings", foreignKey: "owner_id"})
Housing.belongsTo(User, {as: "host", foreignKey: "owner_id"})

// Guest's housings || Bookings
Housing.hasMany(Booking, {as: "bookings", foreignKey: "housing_id"})
User.hasMany(Booking, {as: "bookings", foreignKey: "guest_id"})

// User's favorite housing
// User.hasMany(Housing, {as: "favorite_housings", foreignKey: "user_id"})
// Housing.belongsTo(User, {as: "user_interested", foreignKey: "user_id"})


sequelize.models = {
  User,
  Housing,
  HousingImage,
  HousingReview,
  Booking,
}

module.exports = sequelize