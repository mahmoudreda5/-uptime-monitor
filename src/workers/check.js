const axios = require('axios');
const Check = require('./../models/check');
const Report = require('./../models/report');
const Log = require('./../models/log');


const urlConfig = (check) => {
    let config = {};
    // const configKeys = ['timeout', 'auth', 'headers'];
    // configKeys.forEach(key => {
    //     if(check[key]) config[key] = check[key];
    // });
    if(check.timeout) config.timeout = check.timeout * 1000;
    if(check.auth) config.auth = check.auth;
    if(check.headers) config.headers = check.headers;
    return config;
};

const buildUrl = (check) => {
    let url = `${check.protocol}://${check.url}`;
    if(check.port) url += `:${check.port}`;
    if(check.path) url += `/${check.path}`;

    return url;
};

const run = (check) => {
    setInterval(async () => {  // to be replaced with cron
        const config = urlConfig(check);
        const url = buildUrl(check);
        const response = await axios.get(url, config);
        // await check.populate('report').execPopulate();
        let report = await Report.findOne({ check: check._id });
        const upOrDown = response.status >= 200 && response.status < 300;
        if(!report) {
            report = new Report({
                check: check._id
            });
        }

        if(report.status === 'up' && !upOrDown || report.status === 'down' && upOrDown) {
            console.log('send notification here..');
        }

        report.status = upOrDown ? 'up' : 'down';
        report.availability = upOrDown ? 
                            Math.min((report.uptime + check.interval) / (report.uptime + report.downtime) * 100, 100) : 
                            Math.min((report.downtime + check.interval) / (report.uptime + report.downtime) * 100, 100);
        report.outages = upOrDown ? report.outages : report.outages + 1;
        report.downtime = upOrDown ? report.downtime : report.downtime + check.interval;
        report.uptime = upOrDown ? report.uptime + check.interval : report.uptime;
        report.responseTime = 0;  // to be handled
        await report.save();
        
        const log = new Log({
            status: upOrDown ? 'up' : 'down',
            check: check._id
        });
        await log.save();
    }, check.interval * 1000);
};

module.exports = {
    run
};