const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const wrapAsync = require('./utils/wrapAsync');
const { userSchema } = require('./validationSchema');
const AppError = require('./utils/appError');
const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb+srv://admin-himanshi:himanshi@2000@cluster0.bcbc9.mongodb.net/fsProject', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log("Mongo connection on!")
    })
    .catch(e => {
        console.log('Oh no error!');
        console.log(e);
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'myid',
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.user);
    res.locals.currentUser = req.user;
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', validateUser, wrapAsync(async (req, res) => {
    const { email, firstName, lastName, contact, country, password } = req.body;
    const user = new User({ email, firstName, lastName, contact, country });
    user.username = firstName + lastName + Math.floor(Math.random() * 1000);
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) { return next(err) };
        res.redirect('/main');
    })
}))

app.get('/main', wrapAsync(async (req, res) => {
    //console.log(req.user);
    const user = req.user;
    res.render('main', { user });
}))

app.post('/main', wrapAsync(async (req, res) => {
    res.send(req.body);
}))

app.use((err, req, res, next) => {
    const { statusCode = 400 } = err;
    if (!err.message) { err.message = 'Something went wrong' };
    res.status(statusCode).send(err);
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000.');
})