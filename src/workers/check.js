const axios = require('axios');
const Check = require('./../models/check');
const Report = require('./../models/report');
const Log = require('./../models/log');
const mailer = require('./../services/mailer');


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
        const isUp = response.status >= 200 && response.status < 300;
        if(!report) {
            report = new Report({
                check: check._id
            });
        }

        if(report.status === 'up' && !isUp || report.status === 'down' && isUp) {
            // todo: make it more generic, refactor
            await check.populate('owner').execPopulation();
            mailer.send(
                check.owner.email,
                'Server Monitor Notification',
                isUp ? 'Server is up' : 'Server is down'
            );
        }

        report.status = isUp ? 'up' : 'down';
        report.availability = isUp ? 
                            Math.min((report.uptime + check.interval) / (report.uptime + report.downtime) * 100, 100) : 
                            Math.min((report.downtime + check.interval) / (report.uptime + report.downtime) * 100, 100);
        report.outages = isUp ? report.outages : report.outages + 1;
        report.downtime = isUp ? report.downtime : report.downtime + check.interval;
        report.uptime = isUp ? report.uptime + check.interval : report.uptime;
        report.responseTime = 0;  // to be handled
        report.save();
        
        const log = new Log({
            status: isUp ? 'up' : 'down',
            check: check._id
        });
        log.save();
    }, check.interval * 1000);
};

module.exports = {
    run
};