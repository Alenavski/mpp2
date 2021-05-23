import React, {useEffect, useState} from 'react';
import {useHttp} from "../hooks/http.hooks";
import {useMessage} from "../hooks/message.hooks";
import {useHistory} from "react-router-dom";

export const CreateTask = () => {
    const message = useMessage()
    const history = useHistory()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState( {
        name: '', status: '', date: ''
    })
    const [file, setFile] = useState([])


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

    const fileHandler = event => {
        setFile([...file, event.target.files[0]])
    }

    const uploadHandler = async () => {
        try {
            let formData = new FormData()
            formData.set('file', file[0])

            const data = await request('api/tasks/upload', 'POST', formData)
            message(data.message)
        } catch (e) {

        }
    }

    const createHandler = async () => {
        try{
            const data = await request('/api/tasks/add', 'POST', {...form})
            if (file.length > 0) {
                await uploadHandler()
            }
            message(data.message)
            history.push("/tasks")
        } catch(e){

        }
    }

    return (
        <div className="row" style={{paddingTop: '2rem'}}>
            <div className="col s8 offset-s2">
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title" style={{paddingBottom: '1rem'}}>Create Task</span>

                        <div className="input-field">
                            <input
                                placeholder="name"
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
                                placeholder="status"
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
                                placeholder="Finish date"
                                id="date"
                                type="date"
                                name="date"
                                className="red-input"
                                onChange={changeHandler}
                            />
                            <label htmlFor="date">Finish date</label>
                        </div>

                        <div className="file-field input-field">
                            <div className="btn red">
                                <span>File</span>
                                <input
                                    id="file"
                                    type="file"
                                    name="file"
                                    className="red-input"
                                    onChange={fileHandler}
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text"/>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn red"
                            onClick={createHandler}
                            disabled={loading}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
