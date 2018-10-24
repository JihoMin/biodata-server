'use strict';

var express = require('express');
var router = express.Router();

var child_process = require('child_process');
var exec = child_process.exec;

const mysql = require("mysql2/promise");
const { MYSQL_URL, MYSQL_ID, MYSQL_PWD } = process.env;


// create DB pool
var pool = mysql.createPool({
    host: "biodatalab.czadlpaqcfqu.ap-northeast-2.rds.amazonaws.com",
    user: "blab",
    password: "biodatalab!",
    database: "서울대병원"
});

const getSNU = async () => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const [rows] = await connection.query(
                `SELECT 문진.바코드, 문진.날짜, 고혈압, 당뇨, 당뇨병가족력, 암과거력, 약복용력, 여성호르몬제제_또는_경구피임제__복용한적_또는_현재복용중_여부, 내부_장기_맹장_제외__수술력, 음주량, 흡연, HBsAg, Anti_HIV, Anti_HCV
                FROM 문진
                JOIN 혈액_소변_대변
                ON 문진.바코드 = 혈액_소변_대변.바코드 AND 문진.날짜 = 혈액_소변_대변.날짜;`
            );
            connection.release();
            // console.log(rows)
            return rows;
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

router.get('/', (req, res) => {
    res.render('logarithm', {
        title: 'Calculate Logarithm'
    });
});

router.post('/', async (req,res) => {
    // var a = req.body.a;
    // var b = req.body.b;
    const data = await getSNU();
    // console.log(data);

    var a = data
    var b = [['fsf','fsdf'],['fdfs','sdf']]

    console.log('a,b: ',a,b)
    console.log(process.cwd())
    var dir = process.cwd()+'/src/rscripts/log_wrapper.R'
    var cmd = 'Rscript ' + dir + " " + a + " " + b;


    exec(cmd, (error, stdout, stderr) => {
        if(error) {
            console.log(error);
            return;
        }
        res.send("<h2>Log<sub>" + a + "</sub>" + b + " = " + stdout + "</h2>");
    } );
});



module.exports = router;