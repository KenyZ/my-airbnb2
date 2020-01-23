
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


    Housing.getAll = async (limit = 5, offset = 0) => {

        const response = {
            error: false,
            data: null,
        }

        const housings = await Housing.findAll({
            limit,
            offset,
            attributes: {exclude: ["owner_id", "description"]},
            include: [
                {
                    association: "images",
                    attributes: ["id", "url"]
                },
                {
                    association: "reviews",
                    attributes: ["score_checkin", "score_accuracy", "score_location", "score_communication", "score_cleanliness", "score_value",]
                }
            ]
        })

        if(housings){
            
            response.data = housings.map(housingsItem => {

                let score_average = null

                if(housingsItem.reviews){

                    score_average = 0

                    for(let i = 0; i < housingsItem.reviews.length; i++){
                        score_average += (housingsItem.reviews[i].score_checkin
                            + housingsItem.reviews[i].score_accuracy
                            + housingsItem.reviews[i].score_location
                            + housingsItem.reviews[i].score_communication
                            + housingsItem.reviews[i].score_cleanliness
                            + housingsItem.reviews[i].score_value) / 5.0
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
            data: null
        }

        let housing = await Housing.findByPk(id, {
            attributes: {exclude: ["owner_id"]},
            include: [
                {
                    association: "images",
                    attributes: ["id", "url", "description"],
                    separate: true
                },
                {
                    association: "host",
                    attributes: ["id", "first_name", "last_name", "avatar"]
                },
                {
                    association: "reviews",
                    attributes: [
                        [sequelize.fn("AVG", sequelize.col("score_checkin")), "score_checkin"],
                        [sequelize.fn("AVG", sequelize.col("score_value")), "score_value"],
                        [sequelize.fn("AVG", sequelize.col("score_communication")), "score_communication"],
                        [sequelize.fn("AVG", sequelize.col("score_location")), "score_location"],
                        [sequelize.fn("AVG", sequelize.col("score_cleanliness")), "score_cleanliness"],
                        [sequelize.fn("AVG", sequelize.col("score_accuracy")), "score_accuracy"],
                        [sequelize.fn("COUNT", sequelize.col("reviews.id")), "count"]
                    ]
                }
            ]
        })

        if(housing){
            response.data = {
                ...housing.get(),
                reviews: (housing.reviews && housing.reviews[0]) ? {
                    count: housing.reviews[0].get('count'),
                    score_checkin: Math.round(housing.reviews[0].score_checkin * 100) / 100,
                    score_value: Math.round(housing.reviews[0].score_value * 100) / 100,
                    score_communication: Math.round(housing.reviews[0].score_communication * 100) / 100,
                    score_location: Math.round(housing.reviews[0].score_location * 100) / 100,
                    score_cleanliness: Math.round(housing.reviews[0].score_cleanliness * 100) / 100,
                    score_accuracy: Math.round(housing.reviews[0].score_accuracy * 100) / 100,
                } : null
            }
        }

        return response
    }

    return Housing
}