import React, {useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hooks";
import {useMessage} from "../hooks/message.hooks";
import {Link, useHistory} from "react-router-dom";

export const TasksList = ({ tasks }) => {
    const message = useMessage()
    const history = useHistory()
    const {loading, error, request, clearError} = useHttp()
    const [file, setFile] = useState( "")
    const [idTasks, setIdTasks] = useState(0)

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(()=> {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        let id = +event.target.name
        setIdTasks(id)
        setFile([...file, event.target.files[0]])
    }

    const createHandler = async () => {
        try{
            let formData = new FormData()
            formData.set('file', file[0])
            formData.set('idtasks', idTasks.toString())

            const data = await request('api/tasks/upload', 'POST', formData)
            message(data.message)
            history.push("/create")
            history.push("/tasks")
        } catch(e){

        }
    }

    const deleteHandler = async (event) => {
        try {
            let id = +event.target.name
            const data = await request(`api/tasks/delete/${id}`, 'DELETE', null, {})
            message(data.message)
            history.push("/create")
            history.push("/tasks")
        } catch (e) {

        }
    }

    if (tasks === undefined || !tasks.length){
        return <p className="center">There is no tasks!</p>
    }

    return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Files</th>
                </tr>
                </thead>

                <tbody>
                { tasks.map(task => {
                    return (
                        <tr key={task.tasksid}>
                            <td>{task.name}</td>
                            <td>{task.status}</td>
                            <td>{new Date(task.date).toLocaleDateString()}</td>
                            { task.files.map(file => {
                                return (
                                    <div>
                                        <td>
                                            <a href={file.serverFilename} target="_blank" rel="noopener noreferrer" download>{file.filename}</a>
                                        </td>
                                        <br/>
                                    </div>
                                )
                            })}
                            <td>
                                <div className="file-field input-field">
                                    <div className="btn red">
                                        <span>File</span>
                                        <input
                                            id="file"
                                            type="file"
                                            name={task.idtasks}
                                            className="red-input"
                                            onChange={changeHandler}
                                        />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input className="file-path validate" type="text"/>
                                    </div>
                                </div>
                                <div className="card-action">
                                    <button
                                        className="btn red"
                                        onClick={createHandler}
                                        disabled={loading}
                                    >
                                        Add File
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div className="card-action">
                                    <Link to={`/${task.idtasks}`}>Edit task</Link>
                                    <br/>
                                    <button
                                        className="btn red"
                                        name={task.idtasks}
                                        onClick={deleteHandler}
                                        disabled={loading}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
    )
}