const express = require('express');
const session = require('express-session');
const Handlebars = require('express-handlebars');
const WebSocketServer = require('./config/websocket');
const path = require('path');



const exphbs = Handlebars.create({
    extname: 'hbs',
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },

        ifGreaterOrEqual: function (arg1, arg2, options) {
            return (arg1 >= arg2) ? options.fn(this) : options.inverse(this);
        }
    }
});

const router = require('./routes/main').router;

const app = express();

// collect request info
var requests = [];
var responses = [];
var trimThreshold = 5000;
var trimSize = 4000;


app.use(function (req, res, next) {
    requests.push({ time: Date.now(), method: req.method.toString()});
    responses.push({ time: Date.now(), code: res.statusCode});

    // now keep requests array from growing forever
    if (requests.length > trimThreshold) {
        requests = requests.slice(0, requests.length - trimSize);
    }
    if (responses.length > trimThreshold) {
        responses = responses.slice(0, responses.length - trimSize);
    }
    next();
});

app.get("/requests", function (req, res) {
    var now = Date.now();
    var fifteenMinsAgo = now - (15000 * 60);
    // since recent requests are at the end of the array, search the array
    // from back to front
    res.json(requests.filter(request => request.time > fifteenMinsAgo));
});

app.get("/responses", function (req, res) {
    var now = Date.now();
    var fifteenMinsAgo = now - (15000 * 60);
    res.json(responses.filter(response => response.time > fifteenMinsAgo));
});

const HOST_PROTO = 'http';
const HOST_PORT = 3000;
const HOST_ADDRESS = 'localhost';

app.use(session({ secret: 'mega secret' }));
app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', exphbs.engine);
app.set('view engine', 'hbs');

app.use('/', router);

app.listen(HOST_PORT);

console.log(`${HOST_PROTO}://${HOST_ADDRESS}:${HOST_PORT}`);