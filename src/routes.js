const express = require('express');
const mysql = require("mysql2/promise");
const multer = require('multer');
const HIGHBP = require('./DB/insertHIGHBP');
const XLSX = require('./DB/insertXLSX');
const fs = require('fs');
const stream = require('stream');
let upload = multer();

const { MYSQL_URL, MYSQL_ID, MYSQL_PWD } = process.env;

// create DB pool
var pool = mysql.createPool({
    host: MYSQL_URL,
    user: MYSQL_ID,
    password: MYSQL_PWD,
    database: "서울대병원"
});

const router = express.Router();

router.get('/', async (req, res) => {
    const collection = await getHIGHBP();
    //console.log(collection);
    res.send(
        collection
    )
})

// insert a new micro-post
router.post('/', async (req, res) => {
    await insertFruit(req.body.text);
    res.status(200).send();
});

// router.post('/single-file', upload.single('file'), async (req, res) => {
//     var bufferStream = new stream.PassThrough();
//     bufferStream.end(req.file.buffer);
//     try{
//         await HIGHBP.openCSV(bufferStream);
//     } catch(err) {
//         res.send(err)
//     }
//     res.sendStatus(200);
// })

router.post('/single-file', upload.single('file'), async (req, res) => {
    try{
        console.log("hey")
        await XLSX.openXlsx(req.file.buffer).then(s=>{
            console.log('status: ', s);
            if(s == 200)
                res.sendStatus(200);
            else
                res.sendStatus(400);
        })
        
    } catch(err) {
        console.log(err)
        res.send(err)
    }
    
})

router.post('/xlsx', upload.single('file'), async (req, res) => {
    try{
        await HIGHBP.openXlsx(req.file);
    } catch(err) {
        res.send(err)
    }
    res.sendStatus(200);
})

router.get('/HIGHBP', async (req, res) => {
    const data = await getHIGHBP();
    console.log(data);
    res.send(
        data
    )
})

router.get('/SNU', async (req, res) => {
    const data = await getSNU();
    console.log(data);
    res.send(
        data
    )
})


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
            console.log(rows)
            return rows;
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

const getHIGHBP = async () => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const [rows] = await connection.query('SELECT NIHID, SEX, AGE, JOB, HEIGHT, WEIGHT, BMI FROM HIGBP LIMIT 50');
            connection.release();
            return rows;
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

const insertFruit = async (fruit) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const fruit_name = fruit;
            connection.query('INSERT INTO fruit(fruit_name) VALUES(?)',[fruit_name]);
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

const loadMicroPostsCollection = async () => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query('SELECT * FROM fruit');
            connection.release();
            return rows;
        } catch(err){
            console.log('select error');
            console.log(err);
        }
    } catch(err) {
        console.log('connection error');
        console.log(err);
    }
}

module.exports = router;
