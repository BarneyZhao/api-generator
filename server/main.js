const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const chalk = require('chalk');

// const config = require(path.join(__dirname, '/config'));
const app = express();
// app properties setting
app.use(express.static(path.join(__dirname, '/../dist')));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

global.templatePath = path.join(__dirname, '/../template');

// middleware
app.use(require('./middlewares/crossOrigin'));
app.use(require('./middlewares/apiLog'));

// routes setting
app.use(require('./controllers/baseController'));

// server startup
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('\n\t', chalk.green(`Opening on localhost:${server.address().port}\n`));
});
server.setTimeout(0);
