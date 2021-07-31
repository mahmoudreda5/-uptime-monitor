const mongoose = require('mongoose');
const config = require('./../config/config');

const connectionUrl = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`;
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'Database connection error'));
database.once('open', console.info.bind(console, `Database connected on port ${config.database.port}`));