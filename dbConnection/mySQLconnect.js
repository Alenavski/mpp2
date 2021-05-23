const mysql = require("mysql2")

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "task_manager",
    password: "want./1007"
});

module.exports=dbConnection;