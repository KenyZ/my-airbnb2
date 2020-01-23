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
    }
}



const USERS_COUNT = 15
const USERS_ROLE = ["guest", "host"]

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
            user_role: faker.random.arrayElement(USERS_ROLE),
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

        const housing = await sequelize.models.Housing.create({
            title: faker.address.country() + " " + faker.address.city() + " " + faker.address.streetName(),
            info_guest: faker.random.number(7) + 1,
            info_kitchen: infoKitchen === 0 ? null : infoKitchen,
            info_bed: faker.random.number(7) + 1,
            info_wifi: faker.random.boolean(),
            description: faker.random.boolean() ? faker.lorem.paragraph(4) : null,
            owner_id: host.get('id'),
            images: Utils.loop(images, img => ({
                url: faker.image.city(400, 400),
                description: faker.random.boolean() ? faker.lorem.paragraph(2) : null
            })),
        }, {
            include: [
                {
                    model: sequelize.models.HousingImage,
                    as: "images"
                },
            ]
        })

        const bookings = await Promise.all(housingGuests.map(housingGuestsItems => {

            const checkin = moment().subtract(faker.random.number(200), "day")
            const checkout = checkin.add(faker.random.number(16) + 4, "day")

            return sequelize.models.Booking.create({
                checkin: checkin.format("YYYY-MM-DD HH:mm:ss"),
                checkout: checkout.format("YYYY-MM-DD HH:mm:ss"),
                guest_id: housingGuestsItems.get('id'),
                housing_id: housing.get('id'),
            })
        }))

        console.log("####")
        console.log("bookings => " + bookings.length)
        console.log("####")

        const reviews = await Promise.all(housingGuests.map(housingGuestsItems => {
            return sequelize.models.HousingReview.create({
                author_id: housingGuestsItems.get('id'),
                housing_id: housing.get('id'),
                posted_at: new Date(),
                comment: faker.random.boolean() ? faker.lorem.paragraph(2) : null,
                score_checkin: faker.random.number(5),
                score_value: faker.random.number(5),
                score_location: faker.random.number(5),
                score_communication: faker.random.number(5),
                score_cleanliness: faker.random.number(5),
                score_accuracy: faker.random.number(5),
            })
        }))

        console.log("####")
        console.log("reviews => " + reviews.length)
        console.log("####")

    }))

    console.log("####")
    console.log("housings => " + housings.length)
    console.log("####")

    return housings

}

sequelize.sync({force: true}).then(res => {
    console.log("DATABASE HAS BEEN SYNCED")

    generateDumpData().then(res => console.log("ALL DATA HAS BEEN GENERATED"))
})

// generateDumpData().then(res => console.log("ALL DATA HAS BEEN GENERATED"))
