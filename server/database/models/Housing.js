
module.exports = (sequelize, DataTypes) => {

    const Housing = sequelize.define('housing', {

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        location_country: {
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
            allowNull: false,
        }

    }, {
        createdAt: false,
        updatedAt: false,
    })


    // Methods

    const HousingReview = sequelize.import("./HousingReview.js")
    const Op = require('sequelize').Op
    const moment = require('moment')

    Housing.getAll = async (limit = 5, offset = 0) => {

        const response = {
            error: false,
            status: 200,
            data: null,
        }

        const housings = await Housing.findAll({
            limit: limit,
            offset: offset * limit,
            // @NEXT - order by ? created_at ? / most available date ?
            attributes: {exclude: ["owner_id", "description"]},
            include: [
                {
                    association: "images",
                    attributes: ["id", "url"]
                },
                {// @OPTIMIZATION - should do like .getById()
                    association: "reviews",
                    attributes: ["score_checkin", "score_accuracy", "score_location", "score_communication", "score_cleanliness", "score_value",]
                }
            ]
        })

        const housing_count = await Housing.count()            
        
        response.data = {
            pagination: {
                item_count: housing_count,
                page_current: offset,
                page_count: Math.ceil(housing_count / limit)
            },
            list: housings.map(housingsItem => {

                let score_average = null
    
                if(housingsItem.reviews){
    
                    score_average = 0
    
                    for(let i = 0; i < housingsItem.reviews.length; i++){
                        score_average += (housingsItem.reviews[i].score_checkin
                            + housingsItem.reviews[i].score_accuracy
                            + housingsItem.reviews[i].score_location
                            + housingsItem.reviews[i].score_communication
                            + housingsItem.reviews[i].score_cleanliness
                            + housingsItem.reviews[i].score_value) / 6
                    }
    
                    score_average = score_average / housingsItem.reviews.length
                    score_average = Math.round(score_average * 100) / 100
                }
    
                return {
                    id: housingsItem.id,
                    title: housingsItem.title,
                    info_guest: housingsItem.info_guest,
                    info_bed: housingsItem.info_bed,
                    info_kitchen: housingsItem.info_kitchen,
                    info_wifi: housingsItem.info_wifi,
                    rating: {
                        average: score_average,
                        count: housingsItem.reviews.length
                    },
                    images: housingsItem.images
                }
            })
        }

        return response

    }


    Housing.getById = async id => {

        const response = {
            error: false,
            status: 200,
            data: null,
        }

        let housing = await Housing.findByPk(id, {
            attributes: {exclude: ["owner_id"]},
            include: [
                {
                    association: "images",
                    attributes: ["id", "url", "description"],
                },
                {
                    association: "host",
                    attributes: ["id", "first_name", "last_name", "avatar"]
                },
                {
                    association: "reviews",
                    separate: true,
                    attributes: [
                        [sequelize.fn("AVG", sequelize.col("score_checkin")), "score_checkin"],
                        [sequelize.fn("AVG", sequelize.col("score_value")), "score_value"],
                        [sequelize.fn("AVG", sequelize.col("score_communication")), "score_communication"],
                        [sequelize.fn("AVG", sequelize.col("score_location")), "score_location"],
                        [sequelize.fn("AVG", sequelize.col("score_cleanliness")), "score_cleanliness"],
                        [sequelize.fn("AVG", sequelize.col("score_accuracy")), "score_accuracy"],
                        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                    ]
                }
            ]
        })

        if(housing){

            const score_checkin = Math.round(housing.reviews[0].score_checkin * 100) / 100
            const score_value = Math.round(housing.reviews[0].score_value * 100) / 100
            const score_communication = Math.round(housing.reviews[0].score_communication * 100) / 100
            const score_location = Math.round(housing.reviews[0].score_location * 100) / 100
            const score_cleanliness = Math.round(housing.reviews[0].score_cleanliness * 100) / 100
            const score_accuracy = Math.round(housing.reviews[0].score_accuracy * 100) / 100
            const score_total = Math.round(
                100 * (score_checkin + score_value + score_communication + score_location + score_cleanliness + score_accuracy) / 6) / 100

            
            response.data = {
                ...housing.get(),
                reviews: (housing.reviews && housing.reviews[0]) ? {
                    count: housing.reviews[0].get('count'),
                    score_details: {
                        "checkin": score_checkin,
                        "value": score_value,
                        "communication": score_communication,
                        "cleanliness": score_cleanliness,
                        "accuracy": score_accuracy,
                        "location": score_location,
                    },
                    score_total,
                } : null
            }
        } else {
            response.status = 404
            response.error = {message: "NOT FOUND - no housing found"}
        }

        return response
    }

    
    Housing.getReviews = async (housingId = null, limit = 5, offset = 0) => {

        const response = {
            error: false,
            status: 200,
            data: null,
        }

        // check existence / validations
        const housing = await Housing.findByPk(housingId, {
            attributes: ["id"],
            include: [
                {
                    association: "reviews",
                    limit: limit,
                    offset: offset * limit,
                    attributes: {
                        exclude: ["author_id", "housing_id"]
                    },
                    order: [
                        ["posted_at", "DESC"]
                    ],
                    include: [
                        {
                            association: "author",
                            attributes: ["id", "first_name", "last_name", "avatar"]
                        }
                    ]
                }
            ]
        })

        if(housing){
            if(housing.reviews){

                const reviews_count = await HousingReview.count({where: {housing_id: housingId}})

                response.data = {
                    pagination: {
                        item_count: reviews_count,
                        page_current: offset,
                        page_count: Math.ceil(reviews_count / limit)
                    },
                    list: housing.reviews.map(reviewsItem => {
    
                        let score_total = (reviewsItem.get("score_location") + 
                            + reviewsItem.get("score_value")
                            + reviewsItem.get("score_communication")
                            + reviewsItem.get("score_cleanliness")
                            + reviewsItem.get("score_accuracy")
                            + reviewsItem.get("score_checkin")) / 6;
        
                        score_total = Math.round(score_total * 100) / 100
        
                        return {
                            id: reviewsItem.get("id"),
                            posted_at: reviewsItem.get("posted_at"),
                            comment: reviewsItem.get("comment"),
                            author: reviewsItem.get("author"),
                            score_total: score_total
                        }
                    })
                }
            }
        } else {
            response.status = 404
            response.error = {message: "NOT FOUND - no housing found"}
        }
        
        return response
    }
    
    /**
     * @param {string} month - range is [0, 11]
     * @param {string} year - i.e 2020
     */
    Housing.getBookings = async (housingId = null, month, year) => {

        const response = {
            error: false,
            status: 200,
            data: null,
        }

        let _month = (month && Number(month)) || undefined
        let _year = (year && Number(year)) || undefined

        if(month && year){

            const inThisMonth = [
                moment(),
                moment().month(_month).year(_year).endOf('month'),
            ]

            const bookings = await Housing.findByPk(housingId, {
                attributes: ["id"],
                include: [
                    {
                        association: "bookings",
                        attributes: ["id"],
                        through: {
                            attributes: ["checkin", "checkout"],
                            where: {
                                [Op.or]: {
                                    checkin: {
                                        [Op.between]: inThisMonth
                                    },
                                    checkout: {
                                        [Op.between]: inThisMonth
                                    },
                                }
                            }
                        }
                    }
                ]
            })
    
            if(bookings){
                response.data = {
                    month: month,
                    year: year,
                    list: bookings.get("bookings").map(guest => guest.get("booking"))
                }
            } else {
                response.status = 404
                response.error = {message: "NOT FOUND - no housing found"}
            }
        } else {
            response.status = 400
            response.error = {message: "BAD REQUEST - month or year is invalid"}
        }


        return response
    }

    return Housing
}
