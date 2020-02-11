console.clear()
require('dotenv').config()

const sequelize = require('./database.index')

const moment = require('moment')
const faker = require('faker')


const Utils = {
    loop: (n, mapping) => Array(n).fill(true).map(mapping),
    randomSubArray: (array, n) => {
        let _array = [...array]

        if(n >= array.length) return array

        return Utils.loop(n, () => {
            let randomIndex = faker.random.number(_array.length - 1)
            let randomItem = _array[randomIndex]
            _array.splice(randomIndex, 1)
            return randomItem
        })
    },
    randomFloat: (max, min = 0, decimals = 2) => Math.round( ((Math.random() * (max - min)) + min) * Math.pow(10, decimals) ) / Math.pow(10, decimals)
}



const USERS_COUNT = 55
const USERS_ROLE = ["guest", "host"]


let housingsImageCount = 0

async function generateDumpData(){

    console.log("will generate dump data")

    const users = await sequelize.models.User.bulkCreate(Utils.loop(USERS_COUNT, () => {

        const _firstName = faker.name.firstName()
        const _lastName = faker.name.lastName()

        return {
            email: faker.internet.email(_firstName, _lastName),
            first_name: _firstName,
            last_name: _lastName,
            password: "1234",
            avatar: faker.internet.avatar(),
            user_role: Math.random() > .5 ? USERS_ROLE[0] : USERS_ROLE[1],
        }
    }))

    console.log("####")
    console.log("users => " + users.length)
    console.log("####")

    const hosts = users.filter(u => u.get('user_role') === "host")
    const guests = users.filter(u => u.get('user_role') === "guest")

    const housings = await Promise.all(hosts.map(async host => {

        const infoKitchen = faker.random.number(2)
        const images = faker.random.number(7) + 2
        const bookingsCount = guests.length > 1 ? (faker.random.number(guests.length - 1) + 1) : 0
        const housingGuests = Utils.randomSubArray(guests, bookingsCount)

        const location_country = faker.address.country()

        const housing = await sequelize.models.Housing.create({
            title: location_country + " " + faker.address.city() + " " + faker.address.streetName(),
            info_guest: faker.random.number(7) + 1,
            info_kitchen: infoKitchen === 0 ? null : infoKitchen,
            info_bed: faker.random.number(7) + 1,
            info_wifi: faker.random.boolean(),
            description: faker.lorem.paragraph(4),
            location_country: location_country,
            owner_id: host.get('id'),
            images: Utils.loop(images, img => {

                housingsImageCount++;

                return {
                    url: "https://picsum.photos/id/" + housingsImageCount + "/400/400",
                    description: faker.random.boolean() ? faker.lorem.paragraph(2) : null
                }
            }),
        }, {
            include: [
                {
                    model: sequelize.models.HousingImage,
                    as: "images"
                },
            ]
        })

        return housing
    }))

    console.log("####")
    console.log("housings => " + housings.length)
    console.log("####")


    const bookingsAndReviews = await Promise.all(guests.map(async guestsItem => {

        const guestsItemRentedHousings = Utils.randomSubArray(housings, faker.random.number(housings.length - 1) + 1)

        const bookings = await sequelize.models.Booking.bulkCreate(guestsItemRentedHousings.map(h => {

            const checkin = moment().subtract(faker.random.number(120 * (Math.random() > .5 ? -1 : 1)), "day")
            const checkout = checkin.clone().add(faker.random.number(8) + 2, "day")

            return {
                checkin: checkin.format("YYYY-MM-DD HH:mm:ss"),
                checkout: checkout.format("YYYY-MM-DD HH:mm:ss"),
                guest_id: guestsItem.get('id'),
                housing_id: h.get('id'),
            }
        }))
        

        // console.log("####")
        // console.log("bookings => " + bookings.length)
        // console.log("####")

        const reviews = await sequelize.models.HousingReview.bulkCreate(guestsItemRentedHousings.map(h => {

            return {
                author_id: guestsItem.get('id'),
                housing_id: h.get('id'),
                posted_at: moment().subtract(faker.random.number(200), "day").format("YYYY-MM-DD HH:mm:ss"),
                comment: faker.random.boolean() ? faker.lorem.paragraph(2) : null,
                score_checkin: Utils.randomFloat(5.0, 2.3, 2),
                score_value: Utils.randomFloat(5.0, 2.3, 2),
                score_location: Utils.randomFloat(5.0, 2.3, 2),
                score_communication: Utils.randomFloat(5.0, 2.3, 2),
                score_cleanliness: Utils.randomFloat(5.0, 2.3, 2),
                score_accuracy: Utils.randomFloat(5.0, 2.3, 2),
            }
        }))        

        // console.log("####")
        // console.log("reviews => " + reviews.length)
        // console.log("####")

        return {bookings, reviews}
    }))


    console.log("####")
    console.log("bookingsAndReviews => " + bookingsAndReviews.length)
    console.log("####")

    return bookingsAndReviews

}

sequelize.sync({force: true}).then(res => {
    console.log("DATABASE HAS BEEN SYNCED")

    generateDumpData().then(res => {
        console.log("ALL DATA HAS BEEN GENERATED")
        process.exit(0)
    })
})

// generateDumpData().then(res => {
//     console.log("ALL DATA HAS BEEN GENERATED")
//     process.exit(0)
// })
