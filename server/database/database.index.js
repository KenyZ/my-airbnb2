
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
User.hasMany(Housing, {as: "owned_housings", foreignKey: "owner_id"})
Housing.belongsTo(User, {as: "owned_housings", foreignKey: "owner_id"})

// Guest's housings
Housing.belongsToMany(User, {through: Booking, foreignKey: "rented_housing", otherKey: "guest_id"})
User.belongsToMany(Housing, {through: Booking, otherKey: "rented_housing", foreignKey: "guest_id"})



module.exports = {sequelize, models: {
  User,
  Housing,
  HousingImage,
  HousingReview,
  Booking,
}}