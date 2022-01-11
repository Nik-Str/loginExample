require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

//Session options
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      //secure: true,
      sameSite: true,
    },
    rolling: true,
    resave: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      collectionName: 'sessions',
      ttl: 60 * 60,
      autoRemove: 'interval',
      autoRemoveInterval: 10,
      touchAfter: 10 * 60,
      crypto: {
        secret: process.env.SESSION_SECRET,
      },
    }),
  })
);

//DB setup and connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('=> Connected to DB'));

//Main page
const mainRouter = require('./routes/main');
app.use('/', mainRouter);

//Login Rest API
const loginRouter = require('./routes/login');
app.use('/user', loginRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => console.log(`=> Server is listening on port ${port}`));
