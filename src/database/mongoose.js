const mongoose = require('mongoose');

const databaseName = 'server-monitor-api';
const connectionUrl = `mongodb://127.0.0.1:27017/${databaseName}`;
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'Database connection error'));
database.once('open', console.info.bind(console, 'Database connected on port 27017'));