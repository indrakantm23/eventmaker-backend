const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const eventRouter = express.Router();
const db = require('./model/db');

// IMPORT ROUTERS
const eventRouting = require('./routes/eventRouter');

app.use(cors());
app.use(bodyParser.json());


app.use('/events', eventRouting);

app.get('/', (req, res) => {
        res.send('Hello')
})

app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`))