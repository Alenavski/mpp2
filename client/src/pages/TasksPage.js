import React, {useState, useCallback, useEffect} from 'react';
import {useHttp} from "../hooks/http.hooks";
import {Loader} from "../components/Loader";
import {TasksList} from "../components/TasksList";


export const TasksPage = () => {
    const [tasks, setTasks] = useState([])
    const {loading, request} = useHttp()
    const [status, setStatus] = useState("")

    const fetchTasks = useCallback(async () => {
        try {
            const fetched = await request('/api/tasks', 'GET', null, {})
            setTasks(fetched)
        } catch (e){}
    }, [request])

    useEffect(() => {
        fetchTasks().then()
    }, [fetchTasks])


    const changeStatusHandler = event => {
        setStatus(event.target.value)
    }

    const filterHandler = useCallback(async () => {
        try {
            const fetched = await request(`/api/tasks/filter?status=${status}`, 'GET', null, {})
            setTasks(fetched)
        } catch (e){}
    }, [request, status])

    if (loading){
        return <Loader />
    }

    return (
        <>
            <div>
                <div className="input-field">
                    <input
                        placeholder="status"
                        id="status"
                        type="text"
                        name="status"
                        className="red-input"
                        onChange={changeStatusHandler}
                    />
                    <label htmlFor="status">Filter</label>
                </div>
                <div className="card-action">
                    <button
                        className="btn red"
                        onClick={filterHandler}
                        disabled={loading}
                    >
                        Filter
                    </button>
                </div>
            </div>
            {!loading && <TasksList tasks={tasks.tasks} />}
        </>

    )
}
