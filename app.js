const express = require("express")
const bodyParser = require("body-parser")
const connection = require('./dbConnection/mySQLconnect')

const app = express()
app.use(express.json( {extended: true}))

app.use('/api/tasks', require('./routes/task.routes'))

//const urlencodedParser = bodyParser.urlencoded({extended: false});

async function start(){
    try{
       await connection.connect(function(err) {
           if (err) {
               return console.error("Ошибка: " + err.message);
           } else {
               console.log("Подключение к серверу MySQL успешно установлено");
           }
       })
        app.listen(5000, function () {
            console.log("Сервер ожидает подключения...");
        })
    }catch (e) {
        console.log(e.message);
        connection.end(function(err) {
            if (err) {
                return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
        });
        process.exit(1);
    }
}

start();