const express = require('express')
const logger = require('morgan')
const app = express()
const cors = require('cors')
const AppConfig = require('./common/app')
const DBConnection = require('./common/database')
const AppRouters = require('./routers')
const corsOptions = {
    credentials: true,
    optionSuccessStatus: 200
}

// 
DBConnection()
app.use(logger('dev'))
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
// app.use(upload.array());
app.use('/uploads', express.static('./uploads'));
app.use(express.json())

app.use(cors(corsOptions));

AppRouters(app)

// Catch 404 Errors and forward them to error controller
app.use((req, res, next) => {
    let err = new Error("Not Found!")
    err.status = 404
    next(err)
})

// error handle function    
app.use((err, req, res, next) => {
    let error = app.get('env') === 'development' ? err : ""
    let status = err.status || 500
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${AppConfig.APP_PORT}`)
})