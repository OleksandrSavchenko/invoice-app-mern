const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const argv = require('minimist')(process.argv.slice(2));

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));
app.use('/api/test', require('./routes/test.routes'));

const PORT = argv.port || config.get('port') || 5000;


async function start() {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    app.listen(PORT, '127.0.0.1', () => console.log(`App has been started on port ${PORT}`));
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
