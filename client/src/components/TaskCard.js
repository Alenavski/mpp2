import React, {useEffect,useState} from 'react'
import {useMessage} from "../hooks/message.hooks";
import {useHistory} from "react-router-dom";
import {useHttp} from "../hooks/http.hooks";

export const TaskCard = ({ task }) => {
    const message = useMessage()
    const history = useHistory()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState( {
        idtasks: task.idtasks, name: '', status: '', date: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(()=> {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm( {...form, [event.target.name]: event.target.value})
    }

    const editHandler = async () => {
        try{
            const data = await request('/api/tasks/edit', 'PUT', {...form})
            message(data.message)
            history.push("/tasks")
        } catch(e){

        }
    }

    return (
        <>
            <div className="row" style={{paddingTop: '2rem'}}>
                <div className="col s8 offset-s2">
                    <div className="card blue darken-1">
                        <div className="card-content white-text">
                            <span className="card-title" style={{paddingBottom: '1rem'}}>Edit Task</span>

                            <div className="input-field">
                                <input
                                    placeholder={task.name}
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="red-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="name">Name</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder={task.status}
                                    id="status"
                                    type="text"
                                    name="status"
                                    className="red-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="status">Status</label>
                            </div>

                            <div className="input-field">
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    className="red-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="date">Old date {new Date(task.date).toLocaleDateString()}</label>
                            </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="btn red"
                                onClick={editHandler}
                                disabled={loading}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}