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

    app.get('/cat-log', (req, res) => {
        exec('tail -50 /home/ubuntu/.forever/5QEB.log', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log('-------------- send logs --------------');
            res.send(stdout.replaceAll('\r', '\n').replaceAll('\n', '<br>'));
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

        exec(`tail -${30*len} /home/ubuntu/.forever/5QEB.log`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            console.log('-------------- send logs --------------');
            res.send(stdout.replaceAll('\r', '\n').replaceAll('\n', '<br>'));
        });
    });

    return app;
};