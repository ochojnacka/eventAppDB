require("dotenv").config()

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.56xca.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB connection error:", error));

const morgan = require("morgan");
app.use(morgan("dev"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const userRoutes = require("./api/routes/users");
app.use("/users", userRoutes);

const eventRoutes = require('./api/routes/events');
app.use('/events', eventRoutes);

const ticketRoutes = require("./api/routes/tickets");
app.use("/tickets", ticketRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        wiadomość: "Not Found"
    });
});

module.exports = app;

