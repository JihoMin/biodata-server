'use strict';

var express = require('express');
var router = express.Router();

var child_process = require('child_process');
var exec = child_process.exec;

router.get('/', (req, res) => {
    res.render('logarithm', {
        title: 'Calculate Logarithm'
    });
});

router.post('/', (req,res) => {
    var a = req.body.a;
    var b = req.body.b;

    var cmd = 'Rscript ./rscripts/log_wrapper.R' + a.toString() + " " + b.toString();

    exec(cmd, (error, stdout, stderr) => {
        if(error) {
            console.log(error);
            return;
        }
        res.send("<h2>Log<sub>" + a.toString() + "</sub>" + b.toString() + " = " + stdout + "</h2>");
    } );
});

module.exports = router;