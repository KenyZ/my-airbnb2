const utils = require("../api.utils")

module.exports = (app, sequelize) => {

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
        const response = await sequelize.models.Housing.getById(housingId)
    
        return res.status(response.status).send(response)
    })
    
    app.get("/housing/:id/review", async (req, res) => {
    
        // params
        const housingId = (req.params.id && Number(req.params.id)) || null
    
        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
    
        //response
        const response = await sequelize.models.Housing.getReviews(housingId, 5, offset)
    
        return res.status(response.status).send(response)
    })
    
    app.get("/housing/:id/booking", async (req, res) => {
    
        // params
        const housingId = (req.params.id && Number(req.params.id)) || null
    
        // query
        const month1 = req.query.from || undefined
        const month2 = req.query.to || undefined
        const year = (req.query.year && Number(req.query.year)) || undefined
    
        //response
        const response = await sequelize.models.Housing.getBookings(housingId, month1, month2, year)
    
        return res.status(response.status).send(response)
    })

    app.put("/housing/:id/book", utils.auth.checkToken, async (req, res) => {

        // params
        const housingId = req.params.id && Number(req.params.id)

        // body
        const from = req.body.from
        const to = req.body.to
        const guestId = req.token.id

        const response = await sequelize.models.Housing.createBooking(guestId, housingId, from, to)
        
        return res.status(response.status).json(response)

    })

    return app
}