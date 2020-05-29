const express = require("express")
const app = express()
const userRouter = require("./routes/user")
const mongoose = require("mongoose")
const connectionString = "mongodb+srv://dbAdmin:dbAdmin@luster0-5y5x2.mongodb.net/test?retryWrites=true&w=majority"
const articleRouter = require('./routes/articles')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const auth = require('./middleware/auth')
const redirectIfAuth = require('./middleware/redirectIfAuth')

app.use(express.urlencoded({extended:true}))
mongoose.connect(connectionString, ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}))

app.set("view engine", "ejs")
app.use(express.static("public"))

const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))

app.get('/', redirectIfAuth, (req,res) => {
    res.render("index")
})

app.use("/user", userRouter)
app.use('/articles', auth, articleRouter)

app.listen(3000)