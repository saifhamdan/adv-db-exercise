// packages
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//routers
const newsdataRouter = require('./routes/newsdataRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const newsRouter = require('./routes/newsRoutes');

// Start Express app
const app = express();

app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = new Date().toISOString();
  }
  req.body.lastModified = new Date().toISOString();

  next();
});


app.use('/api/v1/newsdata', newsdataRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/news', newsRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `this page ${req.originalUrl} doesn't exist on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
