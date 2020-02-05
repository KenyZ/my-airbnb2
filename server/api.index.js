console.clear()

require('dotenv').config()

/** DATABASE */
const sequelize = require('./database/database.index')
const {
    Housing,
    HousingReview,
    User
} = sequelize.models

const express = require('express')
const app = express()

const PORT = 3002

/**
 * INIT API
 */

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000" // quick fix !!!
    })
    next()
})

/**
 * ROUTES
 */

app.get("/", async (req, res) => {
    return res.send({api_running: true})
})

app.get("/housing", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined

    //response
    const response = await Housing.getAll(5, offset)

    return res.status(response.status).send(response)
})

app.get("/housing/:id", async (req, res) => {

    // params
    const housingId = (req.params.id && Number(req.params.id)) || null

    //response
    const response = await Housing.getById(housingId)

    return res.status(response.status).send(response)
})

app.get("/housing/:id/review", async (req, res) => {

    // params
    const housingId = (req.params.id && Number(req.params.id)) || null

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined

    //response
    const response = await Housing.getReviews(housingId, 5, offset)

    return res.status(response.status).send(response)
})

app.get("/housing/:id/booking", async (req, res) => {

    // params
    const housingId = (req.params.id && Number(req.params.id)) || null

    // query
    const month = (req.query.month && Number(req.query.month)) || undefined
    const year = (req.query.year && Number(req.query.year)) || undefined

    //response
    const response = await Housing.getBookings(housingId, month, year)

    return res.status(response.status).send(response)
})


// app.patch("/housing/:id/favorite", async (req, res) => {

//     // params
//     const housingId = (req.params.id && Number(req.params.id)) || null

//     //response
//     const response = await Housing.getBookings(housingId, month, year)

//     return res.status(response.status).send(response)
// })


app.listen(PORT, () => console.log(`API launched on PORT=${PORT}`))


// 200 OK — This is most commonly used HTTP code to show that the operation performed is successful.
// 201 CREATED — This can be used when you use POST method to create a new resource.
// 202 ACCEPTED — This can be used to acknowledge the request sent to the server.
// 400 BAD REQUEST — This can be used when client side input validation fails.
// 401 UNAUTHORIZED / 403 FORBIDDEN— This can be used if the user or the system is not authorised to perform certain operation.
// 404 NOT FOUND— This can be used if you are looking for certain resource and it is not available in the system.
// 500 INTERNAL SERVER ERROR — This should never be thrown explicitly but might occur if the system fails.
// 502 BAD GATEWAY — This can be used if server received an invalid response from the upstream server.
