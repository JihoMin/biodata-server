const _db = {
  users: [
    {id: 1, name: 'Chris', email: 'test@test.com', password: '123123'}
  ],
  logs: [
  ]
}
const mysql = require("mysql2/promise");
var pool = mysql.createPool({
  host: "biodatalab.czadlpaqcfqu.ap-northeast-2.rds.amazonaws.com",
  user: "blab",
  password: "biodatalab!",
  database: "서울대병원"
});
const crypto = require('crypto-promise');

const createUser = async ({email, password}) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      let encryptPwd='';
      let salt=''
      crypto.randomBytes(64, (err, buf) => {
        salt = buf.toString('base64')
        // console.log(salt)
        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
          encryptPwd = key.toString('base64');
          let userInfo = ['admin', email, encryptPwd, salt]
          try{
            connection.query('INSERT IGNORE INTO users(name, email, password, salt) VALUES(?)', [userInfo]);
          } catch (err) {
            console.log(err)
          }
        });
      });
    } catch(err) {
        console.log(err);
      }
  } catch(err) {
      console.log(err);
  }
}
// createUser({email: 'admin', password: 'admin'})


const db = {
    findUser: async({email, password}) => {
    try{
      const connection = await pool.getConnection(async conn => conn);
      try{
        const query = 'SELECT name, email, password, salt FROM users WHERE users.email = \''+email+'\'';
        console.log(query)
        const [rows] = await connection.query(query);
        console.log("dd",rows[0].name)
        connection.release();
        
        let c = await crypto.randomBytes(64); 
        console.log(c)
        
        let salt = rows[0].salt.toString('base64');
        let encryptPwd = await crypto.pbkdf2(password, salt, 100000, 64, 'sha512');
        encryptPwd = await encryptPwd.toString('base64');
        console.log(password, encryptPwd)
        if(encryptPwd === rows[0].password){
          console.log("same")
          return Promise.resolve().then( () => rows)
        } else {
          return null
        }
        
      } catch(err) {
          console.log(err);
      }
    } catch(err) {
        console.log(err);
    }
  },
  findUserById(id) {
    id = id * 1
    const validator = user => user.id === id
    return Promise.resolve()
      .then(() => _db.users.filter(validator)[0])
  },
  findAccessLog ({userId}) {
    return Promise.resolve()
      .then(() => _db.logs.filter(l => l.userId === userId))
  },
  createAccessLog ({userId}) {
    return Promise.resolve()
      .then(() => _db.logs.push({userId, createdAt: new Date}))
  }
}
// findUser({email: 'admin', password: 'admin'})




module.exports = db
