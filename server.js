const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rest = require('./api');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

const api = new rest(app);

const port = 3000;

app.listen(port);

console.log(`Server running on port ${port}`);
