const jwt = require("jsonwebtoken")
const params = require("../api.params")

module.exports = (app, sequelize) => {

    app.post("/auth/signin", async (req, res) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }
    
        const email = req.body.email || null
        const password = req.body.password || null
    
        const loginResults = await sequelize.models.User.login(email, password)
        results = {
            ...loginResults
        }  
    
        if(loginResults.data){
            const token_access = jwt.sign({
                id: loginResults.data.id
            }, process.env.API_SECRET, {
                expiresIn: params.TOKEN_ACCESS_EXPIRY
            })
    
            results.data = {
                token_access: token_access
            }
        }
    
        return res.status(results.status).send(results)
    })

    return app
}