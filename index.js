
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
// const bootstrap = require('bootstrap')

const app = express()

const conn = require('./db/conn')

// Models 
const Servicos = require('./models/Servicos')
const User = require('./models/User')

// Import Routes
const servicosRoutes = require('./routes/servicosRoutes')
const authRoutes = require('./routes/authRoutes')

// Import Contreller
const ServicosController = require('./controllers/ServicosController')

// template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
// recebe resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'esse é nosso segredo..kkkkk',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'session'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
        
    })
)
// flash message
app.use(flash())
// public path
app.use(express.static('public'))
// set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

// Routes
app.use('/servicos', servicosRoutes)
app.use('/', authRoutes)

app.get('/', ServicosController.showServicos)

conn 
    // .sync({force: true})
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))