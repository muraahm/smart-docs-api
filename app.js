const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const PORT = process.env.PORT || 3002;
const http = require('http');
const db = require("./db");
var cors = require('cors');
const app = express();
server = http.createServer(app)
const query = require("./db/queries")(db)
const bodyParser = require('body-parser')

app.use(cors());


const busboy = require('connect-busboy');

const busboyBodyParser = require('busboy-body-parser');
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(busboyBodyParser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const users = require("./routes/users");
const accountants = require("./routes/accountants");


app.use("/api", users(query));
app.use("/api", accountants(query));


server.listen(PORT, () => console.log("I'm listening on " + PORT))
module.exports = app;
