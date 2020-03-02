const jwt = require("jsonwebtoken")

const tokenUtils = {
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

    checkToken: async (req, res, next) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        // get header
        let token = req.header("Authorization")
        // extract text value
        token = token && token.replace("Bearer ", "")

        let verifiedToken = null
        
        if(token){

            const verifyTokenResults = tokenUtils.verifiy(token, process.env.API_SECRET)
            
            if(verifyTokenResults.data){
                verifiedToken = verifyTokenResults.data
            } else {
                results = verifyTokenResults
            }
            
        } else {
            results.error = {
                code: 400,
                message: "BAD REQUEST - token not found in header"
            }
            results.status = 400
        }

        if(results.error){
            return res.status(results.status).json(results)
        } else {
            req.token = verifiedToken
            return next()
        }
    },

    // checkUserRole: (roles = []) => async (req, res, next) => {

    //     let results = {
    //         error: false,
    //         status: 200,
    //         data: null,
    //     }

    //     if(req.token){
    //         if(!roles.includes(req.token.role)){
    //             results.error = {
    //                 code: 403,
    //                 message: "FORBIDDEN - Access denied for role {" + req.token.role + "}"
    //             }
    //             results.status = 403
    //         }
    //     } else {
    //         results.error = {
    //             code: 401,
    //             message: "Unauthorized - token is invalid or has expired"
    //         }
    //         results.status = 401
    //     }

    //     if(results.error){
    //         return res.status(results.status).json(results)
    //     } else {
    //         return next()
    //     }
    // }

}

module.exports = {
    auth
}