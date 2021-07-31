const express = require('express');
require('./database/mongoose');

// const User = require('./models/user');
// const Log = require('./models/log');
// const Check = require('./models/check');
// const Report = require('./models/report');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// const user = new User({
//     firstName: 'mahmoud',
//     lastName: 'reda',
//     email: 'example@reda.com',
//     password: '123456',
// });
// user.save().then(user => console.log('user created: ', user)).catch(error => console.log(error));

// const log = new Log({
//     status: 'up'
// });
// log.save().then(log => console.log('log created: ', log)).catch(error => console.log(error));

// const check = new Check({
//     name: 'checkaya',
//     url: 'https://www.google.com',
//     protocol: 'HTTPS',
//     path: '/server/path',
//     port: 3000,
//     webhook: 'https://www.google.com',
//     timeout: 7,
//     interval: 7,
//     threshold: 7,
//     authentication: {
//         username: 'mr',
//         password: '123456'
//     },
//     httpHeaders: {
//         one: 'hello',
//         two: 'there'
//     },
//     assert: {
//         statusCode: 201
//     },
//     tags: [{ tag: 'hello my friend.. ' }],
//     ignoreSSL: true
// });
// check.save().then(check => console.log('check created: ', check)).catch(error => console.log(error));

// const report = new Report({
//     status: 'up',
//     availability: 7,
//     outages: 7,
//     downtime: 7,
//     uptime: 7,
//     responseTime: 7
// });
// report.save().then(report => console.log('report created: ', report)).catch(error => console.log(error));

app.listen(port, () => {
    console.log(`Server is up on port ${port} ..`);
});