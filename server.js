const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const eventRouter = express.Router();
const db = require('./model/db');
const cities = require('all-the-cities');

// IMPORT ROUTERS
const eventRouting = require('./routes/eventRouter');
const userRouting = require('./routes/userRouter');

app.use(cors());
app.use(bodyParser.json());


app.use('/events', eventRouting);
app.use('/users', userRouting)

app.get('/', (req, res) => {
        res.send('Hello')
})

app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`))