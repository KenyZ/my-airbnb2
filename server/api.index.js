console.clear()

require('dotenv').config()

/** DATABASE */
const sequelize = require('./database/database.index')
const {
    Housing,
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
        "Access-Control-Allow-Origin": "http://localhost:3000"
    })
    next()
})

/**
 * ROUTES
 */

app.get("/", async (req, res) => {
    return res.send({api_running: true})
})

app.get('/housing', async (req, res) => {

    const limit = (req.query.limit && Number(req.query.limit)) || null
    const offset = (req.query.offset && Number(req.query.offset)) || null

    const {error, data: housings} = await Housing.getAll(limit, offset)

    return res.send(housings)
})

app.listen(PORT, () => console.log(`API launched on PORT=${PORT}`))


// 200 OK — This is most commonly used HTTP code to show that the operation performed is successful.
// 201 CREATED — This can be used when you use POST method to create a new resource.
// 202 ACCEPTED — This can be used to acknowledge the request sent to the server.
// 400 BAD REQUEST — This can be used when client side input validation fails.
// 401 UNAUTHORIZED / 403 FORBIDDEN— This can be used if the user or the system is not authorised to perform certain operation.
// 404 NOT FOUND— This can be used if you are looking for certain resource and it is not available in the system.
// 500 INTERNAL SERVER ERROR — This should never be thrown explicitly but might occur if the system fails.
// 502 BAD GATEWAY — This can be used if server received an invalid response from the upstream server.
