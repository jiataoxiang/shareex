const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const cloudinary = require('cloudinary').v2;
const formData = require('express-form-data');
const config = require('config');
const notificationsRouter = require('./routes/notifications');
const attachmentRouter = require('./routes/attachments');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(formData.parse());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/test', testRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/attachments', attachmentRouter);

// Connect to mongodb with mongoose, this require only runs the javascript file instead of importing it
require('./util/mongoose_connection');

// setup file upload system
cloudinary.config({
  cloud_name: config.get('CLOUD_NAME'),
  api_key: config.get('API_KEY'),
  api_secret: config.get('API_SECRET'),
});

app.post('/api/upload', (req, res) => {
  const public_id = req.body.public_id;
  const options = {};
  if (public_id) {
    options.public_id = public_id;
  }
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path, options));

  Promise.all(promises)
    .then(results => res.json(results))
    .catch(err => res.status(400).json(err));
});

// handle react /:id params. Redirect routes back to react's index.html
// instead of treating as a regular server call
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
