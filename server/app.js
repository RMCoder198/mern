import express from 'express';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import session from 'express-session';
import path from 'path';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import methodOverride from 'method-override';
import bodyParser from 'body-parser'; // PARSE HTML BODY
import passport from 'passport';

require('./passport');
import routesApi from './routes';

const app = express();
const port = 3000;
const devPort = 4000;
app.locals.appTitle = 'mern-blog';

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connected to mongodb server');
});
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/mernblog', {safe: true});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

// public vs ./../public DIFFERENCE?
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, './../public')));

app.use(passport.initialize());
app.use(function(req, res, next) {
  res.locals.signedUser = req.session.user;
  next();
});
app.use('/api', routesApi);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

app.listen(port, () => {
  console.log('Express is listening on port', port);
});

if(process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new webpackDevServer(compiler, config.devServer);
  devServer.listen(
    devPort, () => {
      console.log('webpack-dev-server is listening on port', devPort);
    }
  );
}