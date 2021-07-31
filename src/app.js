const express = require('express');
require('./database/mongoose');
const config = require('./config/config');

const userRouter = require('./routers/user');
const checkRouter = require('./routers/check');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(checkRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${config.port} ..`);
});