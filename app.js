if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routes/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const secret = process.env.SECRET || 'no-one-knows-my-secret!'

const MongoStore = require('connect-mongo')

main()
    .then(res => console.log('DATABASE CONNECTED!'))
    .catch(err => console.log(`Oh no mongo connection error :( ${err}`))
async function main() {
    await mongoose.connect(dbUrl)
}

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.use(mongoSanitize())

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

store.on("error", function (err) {
    console.log("SESSION STORE ERROR", err)
})

const sessionConfig = {
    store,
    name: 'my-Session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND :(', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'SOMETHING WENT WRONG'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})