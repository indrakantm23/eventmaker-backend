const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const eventRouter = express.Router();
const db = require('./model/db');
const cities = require('all-the-cities');

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');

// IMPORT ROUTERS
const eventRouting = require('./routes/eventRouter');
const userRouting = require('./routes/userRouter');
const bookingRouting = require('./routes/bookingsRouter');

const swaggerOptions = {
        definition: {
                openapi: '3.0.0',
                info: {
                        title: 'Employee management',
                        version: '1.0.0',
                        description: 'Employee api',
                        contact: {
                                name: 'Indrakant Mishra',
                                url: 'http://indrakant23m.web.app/',
                                email: 'indrakant23m@gmail.com'
                        },
                        servers: ["http://localhost:4000"]
                }
        },
        apis: ["server.js"]
}

// const swaggerDocs = swaggerJSDoc(swaggerOptions);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(cors());
app.use(bodyParser.json());


app.use('/events', eventRouting);
app.use('/users', userRouting);
app.use('/bookings', bookingRouting);

app.get('/', (req, res) => {
        res.send('Hello')
})

app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`))