//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//define the express app
const app = express();

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS req
app.use(cors());

// log HTTP req
app.use(morgan('combined'));

// ... other require statements
const routes = require('./routes/routes');

// express app definition and middleware config


var rscript = require('./routes/rscripts');
app.use('/rscipt', rscript);
app.use('/', routes);

port = 80;
app.listen(port, () => {
    console.log('listning on port', port);
});

module.exports = app;
