const {Router} = require('express')
const router = Router()
let task_manager = require('../model/tasks')
const multer = require("multer")
const bodyParser = require("body-parser")

let statuses = ['pending', 'running', 'completed'];
let tasks;

//api/tasks
router.get("/", async (req, res) => {
    try{
        tasks = await task_manager.getTasks();
        res.status(200).json({
            tasks: tasks
        })
    }
    catch (e) {
        res.status(500).json({message: 'Что-то пошло не так...'})
    }
})

//api/tasks/filter
router.get("/filter", async (req, res) => {
    let status = req.query.status
    if (status === "all") {
        res.status(200).json( {
            tasks: tasks,
            message: "Filter complete!"
        })
    }
    else {
        try {
            let filtTasks = task_manager.getTasksByStatus(status);
            res.status(200).json({
                tasks: filtTasks,
                message: "Filter complete!"
            })
        }
        catch(e){
            res.status(500).json({message: "Status not found"})
        }
    }
})

//api/tasks/$param
router.get('/:id', async (req, res) => {
    try {
        const task = await task_manager.getTaskById(req.params.id)
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({message: "Something is wrong, try next week"})
    }
})

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "C:\\mpp\\client\\public\\files");
    },
    filename: async (req, file, cb) => {
        cb(null, task_manager.getNameWExt(file.originalname) +
            "(" + (await task_manager.getMaxIdFile() + 1) + ")"
            + task_manager.getExt(file.originalname));
    }
});

//api/tasks/add
router.post("/add",
    async (req, res) => {
        const {name, status, date} = req.body
        if (!name) return res.status(400).json({message: 'Field Name must be filled'})
        if (!status) return res.status(400).json({message: 'Field Status must be filled'})
        if (!date) return res.status(400).json({message: 'Field Date must be filled'})

        let newStatus = task_manager.setStatus(date, status);
        await task_manager.addTask(name, newStatus, date);

        res.status(200).json({message: 'Task created!'})
    }
)

//api/tasks/upload
router.post("/upload", multer({storage:storageConfig}).single('file'),
    async (req, res) => {

        const filename = req.file.filename
        let taskid;
        if (!req.body?.idtasks){
            taskid = await task_manager.findLastTask()
        }
        else
            taskid = req.body.idtasks

        await task_manager.addFile(filename, taskid)
        res.status(200).json({message: "Файл загружен"});
})

//api/tasks/delete
router.delete("/delete/:id", async(req, res) => {
    await task_manager.deleteTask(req.params.id)
    res.status(200).json({message: "Task deleted!"})
})

//api/tasks/edit
router.put("/edit", async(req, res) => {
    const {idtasks, name, status, date} = req.body
    let code = await task_manager.updateTask(idtasks, name, status, date);
    if (code){
        res.status(200).json({message: "Task edited"})
    }
    else {
        res.status(500).json({message: "No changes"})
    }
})

module.exports = router