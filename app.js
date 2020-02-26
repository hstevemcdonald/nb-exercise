const express = require('express');
const createError = require('http-errors');

const doctorsRouter = require('./routes/doctors');

const app = express();

app.use(express.json());
app.use(doctorsRouter);

app.use(function(req, res, next) {
    next(createError(404, `Route ${req.url} not found.`));
});

app.use(function(error, req, res) {
    res.status(error.status || 500);
    res.json({
        status: error.status,
        message: error.message,
        stack: ''
    });
});

module.exports = app;
