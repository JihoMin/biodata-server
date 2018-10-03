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
        let status = await XLSX.openXlsx(req.file.buffer);
        console.log('status: ', status);
        if(status == 200)
            res.send(status);
        else
            res.send(status)
    } catch(err) {
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


const getHIGHBP = async () => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const [rows] = await connection.query('SELECT NIHID, SEX, AGE, JOB, HEIGHT, WEIGHT, BMI FROM KOGES LIMIT 50');
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
