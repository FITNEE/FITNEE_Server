const express = require('express');
const {exec} = require('child_process');

module.exports = function() {
    const app = express();

    app.post('/github-webhook', (req, res) => {
        exec('cd /home/ubuntu/git_clone/healthgpt_backend && git pull', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log(stdout);
            res.sendStatus(200);
        });
    });

    app.get('/npm-install', (req, res) => {
        exec('cd /home/ubuntu/git_clone/healthgpt_backend && npm install', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log(stdout);
            res.sendStatus(200);
        });
    });

    app.get('/restart', (req, res) => {
        exec(`cd /home/ubuntu/git_clone/healthgpt_backend && echo -e "${Date()}" >> src/dev/log.js`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log(stdout);
            // res.sendStatus(200);
            res.redirect('/cat-log');
        });
    });

    app.get('/cat-log', (req, res) => {
        exec('tail -50 /home/ubuntu/.forever/_yv3.log', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log('-------------- send logs --------------');
            
            var logContent = stdout;
            logContent = logContent.replaceAll('\r', '\n').replaceAll('\n', '<br>');
            logContent = logContent.replaceAll('[31m', '<span style="color:red;">');
            logContent = logContent.replaceAll('[32m', '<span style="color:green;">');
            logContent = logContent.replaceAll('[33m', '<span style="color:Goldenrod;;">');
            logContent = logContent.replaceAll('[39m', '</span>');
            res.send(logContent);
        });
    });

    app.get('/cat-log/:len', (req, res) => {
        const len = Number(req.params.len);

        if (!len) {
            console.error('path param is wrong (not a num)');
            return res.sendStatus(501);
        }
        if (len<0) {
            console.error('path param is wrong (negative number)');
            return res.sendStatus(501);
        }

        exec(`tail -${30*len} /home/ubuntu/.forever/_yv3.log`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log('-------------- send logs --------------');

            var logContent = stdout;
            logContent = logContent.replaceAll('\r', '\n').replaceAll('\n', '<br>');
            logContent = logContent.replaceAll('[31m', '<span style="color:red;">');
            logContent = logContent.replaceAll('[32m', '<span style="color:green;">');
            logContent = logContent.replaceAll('[33m', '<span style="color:Goldenrod;;">');
            logContent = logContent.replaceAll('[39m', '</span>');
            res.send(logContent);
        });
    });

    return app;
};