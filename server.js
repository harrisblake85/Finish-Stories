const express  = require('express');
const mongoose = require('mongoose');
const morgan   = require('morgan');
const session  = require('express-session');
const methodOverride = require('method-override');
const app      = express();
const PORT     = process.env.PORT||3000;

// connect to database
const mongoURI = process.env.MONGODB_URI ||'mongodb://localhost:27017/finish-stories';
mongoose.connect(mongoURI, { useMongoClient: true});
mongoose.Promise = global.Promise;

// test db connection
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message));
db.on('connected', () => console.log('Mongo running: ', mongoURI));

// middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(session({
	 secret: "tslllhdfhkjjkgggidfhsjgh",
	 resave: false,
	 saveUninitialized: false
}));
// controllers
const threadsController = require('./controllers/threads.js');
const piecesController = require('./controllers/pieces.js');
const sessionsController = require('./controllers/session.js');

app.use('/threads', threadsController);
app.use('/pieces', piecesController);
app.use('/users', sessionsController);

// root route
app.get('/', (req, res) => res.redirect('/threads'));

// :ear
app.listen(PORT, () => {
  console.log('===========================');
  console.log('Stories app on port: ', PORT);
  console.log('===========================');
});
