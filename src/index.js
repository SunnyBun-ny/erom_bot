require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy.js');

const port = process.env.PORT || 3000;

// Connect to Database
const mongoDbClient = require('./databases/db.js');

// Initialize express app
const express = require('express');
const app = express();

// Setup Middleware
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

// Ensure MongoDB connection before starting the server
mongoDbClient.then((mongooseConnection) => {
    console.log('Connected to MongoDB');

    // Setup Session
    app.use(session({
        secret: process.env.SESSION_SECRET || 'Erom Bot Secret',
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI // Use mongoUrl for connection string
        })
    }));

    // Setup Middleware for Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Hello World Route
    app.use('/', require('./routes/hello'));

    // Middleware Route
    const authRoute = require('./routes/auth.js');
    app.use('/auth', authRoute);

    // Dashboard Route
    const dashboardRoute = require('./routes/dashboard.js');
    app.use('/dashboard', dashboardRoute);

    // Listen to port
    app.listen(port, () => console.info(`App is listening at http://localhost:${port}`));
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});
