let db_connect = require("../dbConnection/mySQLconnect")

let tasks;

async function getTasks() {
    let files;

    await db_connect.promise().query("SELECT * FROM tasks WHERE DATE(date)").then(async ([rows, fields]) => {
        // if (err) return console.log(err);

            tasks = rows;
            await db_connect.promise().query("SELECT * FROM files").then(([rows, fields]) => {
                    // if (err) return console.log(err);

                    files = rows;
                    for (let task of tasks) {
                        task['files'] = [];

                        task.status = updateStatus(task.date, task.status, task.idtasks);

                        for (let file of files) {
                            if (task.idtasks === file.taskid) {
                                task.files.push(file);
                            }
                            file['serverFilename'] = "\\files\\" + file.filename
                        }
                    }
                }
            ).catch(console.log)
        }
    ).catch(console.log);
    return tasks;
}

async function getTaskById(idTask){
    let task;
    await db_connect.promise().query(
        "SELECT * FROM tasks WHERE idtasks = ?", [idTask]).
        then(([rows, fields]) => {
            task = rows[0]
    }).catch(console.log)
    return task;
}

async function addTask(name, status, date){
    await db_connect.promise().query("INSERT INTO tasks (name, status, date) VALUES (?,?,?)", [name, status, date],
        function (err, data) {
            if (err) return console.log(err);
        }
    )
}

async function findLastTask(){
    let task = 0;
    await db_connect.promise().query("SELECT * FROM tasks WHERE idtasks=(SELECT max(idtasks) FROM tasks)").then(([row, fields]) => {
            // if (err) return console.log(err);

            task = row[0]

    })
    return task.idtasks
}

async function addFile(name, taskId){
    console.log(taskId)
    await db_connect.promise().query("INSERT INTO files (filename, taskid) VALUES (?,?)", [name, taskId]).then(([rows,fields]) => {
    })
}

async function getMaxIdFile(){
    let file = 0;
    await db_connect.promise().query("SELECT * FROM files WHERE idfiles=(SELECT max(idfiles) FROM files)").then(([row, fields]) => {
        file = row[0]
    })
    return file.idfiles;
}

function updateStatus(dateCompletion, userStatus, idTask){
    let status = setStatus(dateCompletion, userStatus);
    db_connect.promise().query("UPDATE tasks SET status = ? WHERE idtasks = ?", [status, idTask],
        function (err, data) {
            if (err) return console.log(err);
        })
    return status;
}

async function updateTask(idTask, name, status, date){
    let code = 0;
    if (name){
        await db_connect.promise().query(
            "UPDATE tasks SET name = ? WHERE idtasks = ?", [name, idTask]).
            then(([rows, fields]) => {

        }).catch(console.log)
        code = 1
    }
    if (status){
        await db_connect.promise().query(
            "UPDATE tasks SET status = ? WHERE idtasks = ?", [status, idTask]).
        then(([rows, fields]) => {

        }).catch(console.log)
        code = 1
    }
    if (date){
        await db_connect.promise().query(
            "UPDATE tasks SET date = ? WHERE idtasks = ?", [date, idTask]).
        then(([rows, fields]) => {

        }).catch(console.log)
        code = 1
    }
    return code
}

function compareDates(date11, date22){
    let date1 = Date.parse(date11);
    let date2 = Date.parse(date22);
    return date1 > date2;
}

function setStatus(dateCompletion, userStatus){
    let status;
    let isCompleted = compareDates(new Date(), dateCompletion);
    if (isCompleted)
        status = 'completed'
    else if (userStatus === 'completed')
        status = 'running'
    else
        status = userStatus;
    return status;
}

function getNameWExt(filename) {

    let slash = 0;
    for (let i = 0; i < filename.length; i++)
        if (filename.charAt(i) === '\\') slash = i;
    for (let i = filename.length - 1; i > -1; i--) {
        if (filename.charAt(i) === '.') return filename.substring(slash, i)
    }
}

function getExt(filename) {
    for (let i = filename.length - 1; i > -1; i--) {
        if (filename.charAt(i) === '.') return filename.substring(i, filename.length)
    }
}

function getTasksByStatus(status) {
    let newTasks = [];
    for (let taskKey in tasks) {
        if (tasks[taskKey].status == status) {
            newTasks.push(tasks[taskKey]);
        }
    }
    return newTasks;
}

async function deleteTask(idTask){
    await db_connect.promise().query(
        "DELETE FROM tasks WHERE idtasks = ?", [idTask]).then(
        ([rows, fields]) => {

        }).catch(console.log)
}

module.exports= {getTasks, getTaskById,addTask, addFile, setStatus, getMaxIdFile, getExt, getNameWExt, getTasksByStatus, findLastTask, deleteTask, updateTask}