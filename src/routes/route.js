const express = require('express');
const mysql = require("mysql2/promise");
const multer = require('multer');
const HIGHBP = require('../DB/insertHIGHBP');
const XLSX = require('../DB/insertXLSX');
const fs = require('fs');
const stream = require('stream');
let upload = multer();

const db = require('../mockdb')
const auth = require('../auth')

const { MYSQL_URL, MYSQL_ID, MYSQL_PWD } = process.env;

// create DB pool
var pool = mysql.createPool({
    host: MYSQL_URL,
    user: MYSQL_ID,
    password: MYSQL_PWD,
    database: "서울대병원"
});

const router = express.Router();

// authentication
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    console.log({email, password})
    try{
        const user = await db.findUser({email, password});
        console.log(user)
        if (!user || !user[0] || !user[0].email) return res.status(401).json({error: 'Login failure'})
        
        await db.createAccessLog({userId: user.id})
        const accessToken = auth.signToken(user.id)
        res.json({accessToken})
    } catch (err) {
        console.log(err)
    }
})

router.get('/home', async (req, res) => {
    let user
    try {
      user = auth.verify(req.headers.authorization)
    } catch (e) {
  
    }

    console.log(user)
    user = user ? await db.findUserById(user.id) : null
    const name = user ? user.name : 'World'
  
    res.json({greeting: `Hello ${name}`})
  })
  
router.get('/me', auth.ensureAuth(), async (req, res) => {
    const user = await db.findUserById(req.user.id)
    const accessLog = await db.findAccessLog({userId: user.id})
    res.json({user, accessLog})
})

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
    // console.log(data);
    res.send(
        data
    )
})

router.get('/SNU', async (req, res) => {
    const data = await getSNU();
    res.send(
        data
    )
})

router.get('/summary', async (req, res) => {
    var summary = [];
    var su = `
    SELECT	
    (SELECT count(*) from 문진) -	
    (SELECT count(*) 	
    FROM 문진	
    JOIN 혈액_소변_대변	
    ON 문진.바코드 = 혈액_소변_대변.바코드 AND 문진.날짜 = 혈액_소변_대변.날짜	
    WHERE 고혈압 = 1 OR 당뇨 = 1 OR 당뇨병가족력 = 1 OR 암과거력 is not null OR 약복용력 = 2 OR 약복용력 = 3 OR (여성호르몬제제_또는_경구피임제__복용한적_또는_현재복용중_여부 = 1 AND substr(문진.날짜,1,4) = 복용력_있는경우_년_까지) OR 내부_장기_맹장_제외__수술력 != 0 OR 음주량>=14 OR 흡연=3 OR HBsAg LIKE '%Positive%' OR Anti_HIV LIKE '%Positive%' OR Anti_HCV LIKE '%Positive%')	
    AS super_control;
    `
    var na = `
    SELECT	
    (SELECT count(*)	
    FROM 혈액_소변_대변 a	
        INNER JOIN 문진 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜
        INNER JOIN abdominal c ON a.바코드 = c.바코드 AND a.날짜 = c.date
    WHERE	
    a.HBsAg NOT LIKE '%Positive%' AND a.Anti_HCV NOT LIKE '%Positive%' AND b.음주량 < 14 AND c.Fatty_liver = 0)	
    AS NAFLD_control,	
    (SELECT count(*)	
    FROM 혈액_소변_대변 a	
        INNER JOIN 문진 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜
        INNER JOIN abdominal c ON a.바코드 = c.바코드 AND a.날짜 = c.date
    WHERE	
    a.HBsAg NOT LIKE '%Positive%' AND a.Anti_HCV NOT LIKE '%Positive%' AND b.음주량 < 14 AND c.Fatty_liver = 1 OR c.Fatty_liver = 2 OR c.Fatty_liver = 3)	
    AS NAFLD_case;
    `
    var da = `
    SELECT		
    (SELECT count(*)		
    FROM 혈액_소변_대변 a		
        INNER JOIN 문진 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜	
    WHERE		
    a.GLUCOSE < 100 AND HbA1c < 5.7 AND (b.당뇨=0 OR b.당뇨 is null) AND (b.당뇨_투약중 = 0 OR b.당뇨_투약중 is null))		
    AS 정상,		
    (SELECT count(*)		
    FROM 혈액_소변_대변 a		
        INNER JOIN 문진 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜	
    WHERE		
    a.GLUCOSE >= 100 AND a.GLUCOSE <= 125 AND HbA1c < 5.7 AND (b.당뇨 = 0 OR b.당뇨 is null) AND (b.당뇨_투약중 = 0 OR b.당뇨_투약중 is null))		
    AS 내당능장애,		
    (SELECT count(*)		
    FROM 혈액_소변_대변 a		
        INNER JOIN 문진 b ON a.바코드 = b.바코드 AND a.날짜 = b.날짜	
    WHERE		
    a.GLUCOSE > 125 AND HbA1c > 6.4 AND b.당뇨 = 1 AND b.당뇨_투약중 = 1)		
    AS 당뇨;
    `
    const supercontrol = await getQuery(su);
    const NAFLD = await getQuery(na);
    const dang = await getQuery(da);

    summary.push(supercontrol);
    summary.push(NAFLD);
    summary.push(dang);

    console.log (summary);
    res.send(summary)
})

const getQuery = async (q) => {
    try{
        const connection = await pool.getConnection(async conn => conn);
        try{
            const [rows] = await connection.query(q);
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
            // console.log(err);
        }
    } catch(err) {
        // console.log(err);
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
            // console.log(err);
        }
    } catch(err) {
        // console.log(err);
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



module.exports = router;
