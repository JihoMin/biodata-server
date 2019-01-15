'use strict';

var express = require('express');
var router = express.Router();

var child_process = require('child_process');
var exec = child_process.exec;

const mysql = require("mysql2/promise");
const { MYSQL_URL, MYSQL_ID, MYSQL_PWD } = process.env;
var fs = require('fs');
var R = require('r-script');
const csv = require('fast-csv');



// create DB pool
var pool = mysql.createPool({
    host: MYSQL_URL,
    user: MYSQL_ID,
    password: MYSQL_PWD,
    database: "서울대병원"
});

const getSNU = async () => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const [rows] = await connection.query(
                `SELECT CHOL, HDL_CHOL, TG, 체질량지수___Body_mass_index, GLUCOSE, 체중_Weight, SBP, DBP, 신장_Height, 나이
                FROM 혈액_소변_대변 a	
                    INNER JOIN 체지방측정 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜
                    INNER JOIN 혈압측정 c ON a.바코드 = c.바코드 AND a.날짜 = c.날짜
                    INNER JOIN 인적사항 d ON a.바코드 = c.바코드 AND a.날짜 = d.날짜;`
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
    try {
        const data = await getSNU();
        // console.log(data);

        var a = data
        var b = [['fsf','fsdf'],['fdfs','sdf']]
        // console.log(util.format(a));
        // console.log('a,b: ',a,b)
        // console.log(process.cwd())
        var clinical_data = [];
        var histogram_ahn = [];

        clinical_data.push(["TCHL", "HDL", "TG", "BMI",	"GLU", "WEIGHT", "SBP",	"DBP", "HEIGHT", "AGE"]);
        histogram_ahn.push(["AGE", "WEIGHT", "BMI", "SBP", "DBP", "GLU", "TCHL", "HDL", "TG"]);

        for(var i=0; i<data.length; i++){
            var row = data[i];
            var clinical = [];
            var histogram = [];
            clinical.push(
                        row.CHOL, 
                        row.HDL_CHOL, 
                        row.TG, 
                        row.체질량지수___Body_mass_index, 
                        row.GLUCOSE,
                        row.체중_Weight,
                        row.SBP,
                        row.DBP,
                        row.신장_Height,
                        row.나이
                    );
            clinical_data.push(clinical);

            histogram.push(
                        row.나이,
                        row.체중_Weight,
                        row.체질량지수___Body_mass_index,
                        row.SBP,
                        row.DBP,
                        row.GLUCOSE,
                        row.CHOL, 
                        row.HDL_CHOL,
                        row.TG
                    );
            histogram_ahn.push(histogram);
        }
        var clinicalDir = process.cwd()+'/src/rscripts/clinical.csv'
        var histogramDir = process.cwd()+'/src/rscripts/histogram.csv'
        await csv.writeToPath(clinicalDir, 
                        clinical_data, 
                        {headers: true}
                    ).on("finish", function() {
                        console.log("done1");
                    });

        await csv.writeToPath(histogramDir,
                        histogram_ahn,
                        {headers: true}
                    ).on("finish", function() {
                        console.log("done2");
                    })


        // console.log(parsedData);
        var dir = process.cwd()+'/src/rscripts/log_wrapper.R';
        // var out = R(dir)
        //     .data(parsedData, 20)
        //     .callSync();
        
        // console.log(out);
        var cmd = 'Rscript ' + dir + " " + clinicalDir + " " + histogramDir;
        // +" \"" + histogram_ahn + "\" ";
        exec(cmd, (error, stdout, stderr) => {
            if(error) {
                console.log(error);
                return;
            }
            console.log(stdout)
        } );
    } catch (err) {
        console.log (err)
    }
});



module.exports = router;