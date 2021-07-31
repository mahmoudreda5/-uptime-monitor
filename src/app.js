const express = require('express');
require('./database/mongoose');
const config = require('./config/config');

const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${config.port} ..`);
});