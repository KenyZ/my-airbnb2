const jwt = require("jsonwebtoken")

const tokenUtils = {

    extractToken: async (req, res, next) => {

        // get header
        let token = req.header("Authorization")
        // extract text value
        token = token && token.replace("Bearer ", "")


        if(!token){
            return next()
        } else {
            // keep extracting
            const verifyTokenResults = tokenUtils.verifiy(token, process.env.API_SECRET)

            if(verifyTokenResults.error){
                return next()
            } else {
                req.token = verifyTokenResults.data
                return next()
            }
        }
    },

    verifiy: (token, secret) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try {
            results.data = jwt.verify(token, secret)
        } catch (error) {
            console.log(error)
            results.error = {
                code: 401,
                message: "Unauthorized - token is invalid or has expired"
            }
            results.status = 401
        }

        return results
    },

    signToken: async (payload = {}, secret, expireIn) => {
        //
    },
}

const auth = {

    needAuthentication: async (req, res, next) => {

        if(req.token && req.token.id){
            return next()
        } else {
            return res.json({
                error: {
                    code: 401,
                    message: "Unauthorized - token is invalid or has expired"
                }
            })
        }
    }
        
}

module.exports = {
    auth,
    token: tokenUtils
}