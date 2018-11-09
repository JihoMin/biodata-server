'use strict';
// 모듈 선언
const mysql = require('mysql2/promise');
const fs = require('fs');
const Excel = require('exceljs');
const XlsxPopulate = require('xlsx-populate');

// DB 연결
const { MYSQL_URL, MYSQL_ID, MYSQL_PWD } = process.env;

var pool = mysql.createPool({
    host: MYSQL_URL,
    user: MYSQL_ID,
    password: MYSQL_PWD,
    database: "서울대병원",
    charset: "utf8",
});

var tableNames = []
var fieldsOfEachTable = []

const createTableNames = async (sheet1) => {
    tableNames = []
    for (var i=0; i<sheet1.row(1)._cells.length; i++){
        var tableName = []
        if(sheet1.row(1).cell(i)._value){
            tableName.push(i)
            tableName.push(sheet1.row(1).cell(i)._value.replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]|[()/]/g," ").trim().replace(/ /g,"_"))
            tableNames.push(tableName)
        }
    }
    // 각 테이블의 attribute명이 위치한 row가 다르다.
    // tableNames 배열의 세번째 항목에 attr명들이 위치한 row를 넣는다.
    tableNames[0].push(2)
    tableNames[1].push(2)
    tableNames[2].push(2)

    tableNames[3].push(3)
    tableNames[4].push(3)
    tableNames[5].push(3)
    tableNames[6].push(3)

    console.log(tableNames)
    return tableNames
}

const createTables = async (query) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            connection.query(query);
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

const writeSchema = async (sheet1, tN) => {
    var atts = []
    
    for(var i = 1; i<=60; i++){
        atts.push(sheet1.row(2).cell(i)._value)
    }
    for(var i = 61; i<sheet1.row(3)._cells.length; i++){
        atts.push(sheet1.row(3).cell(i)._value)
    }
    
    var schemas = []
    const base = 'create table if not exists';

    // 각 쿼리에 테이블 명을 붙임
    // atts[0],[1]은 각각 바코드, 날짜로 각 테이블의 key값으로 활용한다.
    for(i=0; i<tN.length; i++){
        schemas.push(base+' '+tN[i][1]+'('+atts[0]+' VARCHAR(16) NOT NULL, '+atts[1]+' VARCHAR(16) NOT NULL, ')
    }
    console.log(atts.length, tN.length)
    // console.log(schemas) 

    // schemas for each table
    // 인적정보
    var fields = ["바코드", "날짜"]
    for(var j=2; j<tN[1][0]-1; j++){
        var field = atts[j].replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]|[()/]/g," ").trim().replace(/ /g,"_")
        schemas[0] = schemas[0] +' '+field+' TEXT,'
        fields.push(field)
    }
    schemas[0] = schemas[0] + ' PRIMARY KEY(바코드, 날짜) )'
    fieldsOfEachTable.push(fields);
   
    // 문진, 기능검사, 혈액소변대변
    for(var i=1; i<tN.length-1; i++){
        fields = ["바코드", "날짜"];
        for(var j=tN[i][0]-1; j<tN[i+1][0]-1; j++){
            var field = atts[j].replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]|[()/]/g," ").trim().replace(/ /g,"_")
            schemas[i] = schemas[i] +' '+field+' TEXT,'
            fields.push(field)
        }
        if(i===3){
            schemas[i] = schemas[i] + ' SBP TEXT, DBP TEXT,'
            fields.push('SBP')
            fields.push('DBP')
        }
        schemas[i] = schemas[i] + ' PRIMARY KEY(바코드, 날짜) )'
        fieldsOfEachTable.push(fields);
    }
    // console.log(schemas)

    // 영상검사
    fields = ["바코드", "날짜"];
    for(var j=tN[6][0]-1; j<atts.length; j++){
        var field = atts[j].replace(/[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9)]|[()/]/g," ").trim().replace(/ /g,"_")
        schemas[6] = schemas[6] +' '+field+' TEXT,'
        fields.push(field)
    }
    schemas[6] = schemas[6] + ' PRIMARY KEY(바코드, 날짜) )'
    fieldsOfEachTable.push(fields);

    // console.log(fieldsOfEachTable)
    
    //console.log(schemas)
    // create query to create tables
    for(var i=0; i<schemas.length; i++){
        createTables(schemas[i]);
    }
}

// Insert Query 날려주는 함수
// 
const insertData2 = async (table, fields, data) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            console.log(table)
            console.log("a")
            var query = 'INSERT IGNORE INTO '+table.toString()+
                    '('+fields.toString()+')'+' VALUES ?';
            connection.query(query, [data]);
        } catch(err) {
            console.log(err);
        }
    } catch(err) {
        console.log(err);
    }
}

// read data row by row
// make them array of arrays
const makeInsertForm = async (usedSheet) => {
    var data = []
    var divided = []
    for(var i=3; i<usedSheet.length; i++){
        if(!usedSheet[i][0]){
            data = usedSheet.slice(0,i);
            break;
        }
    }
    var fa = []
    var fa1 = []
    var fa2 = []
    var fa3 = []
    var fa4 = []
    var fa5 = []
    var fa6 = []
    for(var i=3; i<data.length; i++){
        var f = [data[i][0].toString(),data[i][1].toString()]
        var f1 = [data[i][0].toString(),data[i][1].toString()]
        var f2 = [data[i][0].toString(),data[i][1].toString()]
        var f3 = [data[i][0].toString(),data[i][1].toString()]
        var f4 = [data[i][0].toString(),data[i][1].toString()]
        var f5 = [data[i][0].toString(),data[i][1].toString()]
        var f6 = [data[i][0].toString(),data[i][1].toString()]
        
        for(var j=2; j<tableNames[1][0]-1; j++){
            if(data[i][j])
                f.push(data[i][j].toString())
            else
                f.push(null)
        }
        for(var j = tableNames[1][0]-1; j<tableNames[2][0]-1; j++){
            if(data[i][j])
                f1.push(data[i][j].toString())
            else
                f1.push(null)
        }
        for(var j = tableNames[2][0]-1; j<tableNames[3][0]-1; j++){
            if(data[i][j])
                f2.push(data[i][j].toString())
            else
                f2.push(null)
        }
        for(var j = tableNames[3][0]-1; j<tableNames[4][0]-1; j++){
            if(data[i][j]) {
                let BP = data[i][j].toString()
                f3.push(BP)
                let splitBP = BP.split('/');
                f3.push(splitBP[0]);
                f3.push(splitBP[1]);
            }
            else {
                f3.push(null)
                f3.push(null)
                f3.push(null)
            }
        }
        for(var j = tableNames[4][0]-1; j<tableNames[5][0]-1; j++){
            if(data[i][j])
                f4.push(data[i][j].toString())
            else
                f4.push(null)
        }
        for(var j = tableNames[5][0]-1; j<tableNames[6][0]-1; j++){
            if(data[i][j])
                f5.push(data[i][j].toString())
            else
                f5.push(null)
        }
        for(var j = tableNames[6][0]-1; j<251; j++){
            if(data[i][j])
                f6.push(data[i][j].toString())
            else
                f6.push(null)
        }

        fa.push(f)
        fa1.push(f1)
        fa2.push(f2)
        fa3.push(f3)
        fa4.push(f4)
        fa5.push(f5)
        fa6.push(f6)

        divided.push(fa)
        divided.push(fa1)
        divided.push(fa2)
        divided.push(fa3)
        divided.push(fa4)
        divided.push(fa5)
        divided.push(fa6)
        // console.log(divided[1])
    }

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction();
            for(var i=0; i<7; i++){
                var query = 'INSERT IGNORE INTO '+tableNames[i][1].toString()+
                '('+fieldsOfEachTable[i].toString()+')'+' VALUES ?';
                await connection.query(query, [divided[i]]);
            }
            await connection.commit();
            connection.release();
        } catch(err) {
            console.log(err);
            await connection.rollback(); // ROLLBACK
			connection.release();
			console.log('Query Error');
        }
    } catch(err) {
        console.log(err);
    }
   
    // await insertData2(tableNames[0][1], fieldsOfEachTable[0], divided[0])
    // await insertData2(tableNames[1][1], fieldsOfEachTable[1], divided[1])
    // await insertData2(tableNames[2][1], fieldsOfEachTable[2], divided[2])
    // await insertData2(tableNames[3][1], fieldsOfEachTable[3], divided[3])
    // await insertData2(tableNames[4][1], fieldsOfEachTable[4], divided[4])
    // await insertData2(tableNames[5][1], fieldsOfEachTable[5], divided[5])
    // await insertData2(tableNames[6][1], fieldsOfEachTable[6], divided[6])
    
}

// create table Names (검사 항목에 따라 테이블명 생성)
// 2차원 배열, 각각 시작 col number, 테이블명, atribute명이 있는 row번호를 나타냄

const openXlsx = async (file) => {
    try{
        console.log(file)
        XlsxPopulate.fromDataAsync(file, { password: "0406" })
            .then(workbook => {
                const sheet1 = workbook.sheet(0);
                const usedSheet = sheet1.usedRange().value()
                createTableNames(sheet1)
                    .then( (tN) => {
                        writeSchema(sheet1, tN)
                            .then( () => {
                                makeInsertForm(usedSheet).then(()=>{
                                    return 200;
                                });
                            }).catch(err =>{
                                console.log(err, '1')
                                return err;
                            })
                    }).catch(err => {
                        console.log(err, '2')
                        return err;
                    })
                
            }).catch(err => {
                console.log(err, '3')
                return err;
            })

    } catch(err) {
        console.log(err, 4)
        return 400;
    }
}

module.exports = {
    openXlsx: openXlsx
}