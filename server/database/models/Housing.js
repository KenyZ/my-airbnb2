
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
                    association: "reviews"
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

    return Housing
}