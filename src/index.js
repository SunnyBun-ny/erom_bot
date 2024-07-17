require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const discordStrategy = require('./strategies/discordStrategy.js');
const { logger, requestLogger } = require('./utils/logger.js');
const bodyParser = require('body-parser');
const Constants = require('./contants/contants.js');
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;

// Initialize express app
const app = express();

// Setup CORS
const corsOptions = {
    origin: ['http://localhost:3001'], // Adjust this to your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', (req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204)
});

// Body parser middleware
app.use(bodyParser.json());

// Log all incoming requests
app.use(requestLogger);

// Connect to Database and setup session once connected
const mongoDbClient = require('./databases/db.js');

mongoDbClient.then((mongooseConnection) => {
    logger.info('Connected to MongoDB');

    // Setup Session
    app.use(session({
        secret: process.env.SESSION_SECRET || 'Erom Bot Secret',
        cookie: {
            maxAge: Constants.sessionTime,
        },
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI // Use mongoUrl for connection string
        })
    }));

    // Setup Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use('/', require('./routes/hello'));
    app.use('/auth', require('./routes/auth.js'));
    app.use('/dashboard', require('./routes/dashboard.js'));

    // Error handling middleware
    app.use((err, req, res, next) => {
        logger.error('Unexpected error', { error: err, requestId: req.requestId });
        res.status(500).send('Something went wrong!');
    });

    // Start server
    app.listen(port, () => logger.info(`App is listening at http://localhost:${port}`));
}).catch((error) => {
    logger.error('MongoDB connection error:', error);
});
