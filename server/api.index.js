
const express = require('express')
const app = express()

const PORT = 3002

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000"
    })
    next()
})

app.get("/", async (req, res) => {
    return res.send({foo: 'bar'})
})

app.listen(PORT, () => console.log(`API launched on PORT=${PORT}`))