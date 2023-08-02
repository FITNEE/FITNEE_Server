const express = require('express');
const router = express.Router();
const {exec} = require('child_process');

router.post('/github-webhook', (req, res) => {
    exec('cd /home/ubuntu/git_clone/healthgpt_backend && git pull', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        console.log(stdout);
        res.sendStatus(200);
    });
});

router.post('/npm-install', (req, res) => {
    exec('cd /home/ubuntu/git_clone/healthgpt_backend && npm install', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        console.log(stdout);
        res.sendStatus(200);
    });
});

module.exports = router;