require('dotenv').config()

const {sequelize, models} = require('./database.index')
const {User, Housing, HousingImage} = models
const faker = require('faker')


const Utils = {
    loop: (n, mapping) => Array(n).fill(true).map(mapping)
}



const USERS_COUNT = 15
const USERS_ROLE = ["guest", "host"]

async function generateDumpData(){

    console.log("will generate dump data")

    const users = await User.bulkCreate(Utils.loop(USERS_COUNT, () => {

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

    const housings = await Promise.all(hosts.map(host => {

        const infoKitchen = faker.random.number(2)
        const images = faker.random.number(7) + 2

        return Housing.create({
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
            }))
        }, {
            include: [
                {
                    model: HousingImage,
                    as: "images"
                }
            ]
        })
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
