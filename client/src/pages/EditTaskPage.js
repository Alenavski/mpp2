import React, {useState, useCallback, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hooks";
import {Loader} from "../components/Loader";
import {TaskCard} from "../components/TaskCard";

export const EditTaskPage = () => {
    const {request, loading} = useHttp()
    const [task, setTask] = useState(null)
    const idtasks = useParams().id

    const getTask = useCallback( async () => {
        try {
            const fetched = await request(`api/tasks/${idtasks}`, 'GET', null, {})
            setTask(fetched)
        }catch (e) { }
    }, [idtasks, request])

    useEffect( () => {
        getTask()
    }, [getTask])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <h1 className="center">Edit Page</h1>
            {!loading && task && <TaskCard task={task}/>}
        </>
    )

}