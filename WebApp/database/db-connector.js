var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'username',
    password        : 'password',
    database        : 'cs340_frieschj'
})

module.exports.pool = pool;