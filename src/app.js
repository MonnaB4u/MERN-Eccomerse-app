const express = require('express'); // 1 step
const morgan = require('morgan'); //4th
const bodyParser = require('body-parser'); //5
const createError = require('http-errors'); //6
const xssClean = require('xss-clean') //7
const rateLimit = require('express-rate-limit'); //8

const app = express(); // 2nd step

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 5,
    message: 'Rate limit exceeded try again later'
})


app.use(morgan('dev'));
app.use(bodyParser.json()) //for work with req.body data //5
app.use(express.urlencoded({ extended: true })) //6 for work with form data
app.use(xssClean)
app.use(rateLimit)

const isLogging = (req, res, next) => {
    const login = true;
    if (login) {
        req.body.id
        next();
    } else {
        return res.status(401).json({ message: "Login first" })
    }
}


app.use(isLogging)


app.get('/', rateLimiter, (req, res) => {
    res.send("Api is working fine")
})

app.get('/api/user', (req, res) => {
    res.send(`api user is exist`)
})


// for client Error Handle
app.use((req, res, next) => {
    createError(404, "Route not found")
    next()
})
// for server Error Handle
app.use((err, req, res, next) => {

    return res.status(err.status || 500).json({
        success: false,
        message: err.message
    })

})


module.exports = app;
