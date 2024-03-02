const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const {xss} = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp =  require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

//connect to database
const connectDB = require("./config/db");
connectDB();

//set environment config
dotenv.config({path: "./config/config.env"});

//import router file
const auth = require("./routes/auth");
const reservations = require("./routes/reservations");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

//rate limiter
const limiter = rateLimit({
    windowsMs: 10 * 60 * 1000,
    max : 100
});
app.use(limiter);

const swaggerOptions = {
    swaggerDefinition:{
        openapi : "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description : "A simple Express Massage Reservation API"
        },
        servers:
            [       
                {url: 'http://localhost:' + process.env.PORT +'/api/v1'}
            ],
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//routes
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use("/api/v1/auth",auth)
app.use("/api/v1/reservations",reservations);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log("Server is running in ", process.env.NODE_ENV, " mode on port ", PORT));

process.on("unhandledRejection", (err, promise) => {

    console.log("Error: ", err.message);
    server.close(()=>{process.exit(1)});

});