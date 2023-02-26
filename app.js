const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');


const app = express();


//Connect DB
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://127.0.0.1:27017/smartedu-db', {
}).then(() => {
    console.log('DB Connected Successfully')
});

//Template Engine
app.set('view engine', 'ejs');

//Global Variable
global.userIN = null;


//Middlewares
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/smartedu-db' })
}))
app.use('*', (req, res, next) => { // Taking user id when logged in..
    userIN = req.session.userID;
    next();
});
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
})
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);



//Routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`App started on port ${port}`);
});