require('dotenv').config({ path: `${__dirname}/config.env` });

const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('uncaught exception shutting down');

  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('db connected successfully');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejectecion shutting down');
  console.log(err, err.message);
  server.close(() => {
    process.exit(1);
  });
});
