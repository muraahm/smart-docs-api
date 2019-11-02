const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const PORT = process.env.PORT || 3001;
const http = require('http');
const db = require("./db");
const app = express();
server = http.createServer(app)
const query = require("./db/queries")(db)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const users = require("./routes/users");


app.use("/api", users(query));


server.listen(PORT, () => console.log("I'm listening on " + PORT))
module.exports = app;
