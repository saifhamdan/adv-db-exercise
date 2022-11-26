// this handler is for errors that has nothing to do with async functions
// for quizple trying to log variable doesn't exist in our app
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
// const fetchData = require('./data/databaseData/script');

const DB =
  process.env.DATABASE
    .replace('<USERNAME>', process.env.DATABASE_USERNAME)
    .replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!!!'));

const port = process.env.PORT || 5002;
const app = require('./app');
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

// global error handler for every error we didn't handle or forgot to
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  // it's better practice to close the server first then shut down the process
  server.close(() => {
    process.exit(1);
  });
});
