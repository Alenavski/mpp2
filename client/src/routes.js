import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import {TasksPage} from "./pages/TasksPage";
import {CreateTask} from "./pages/CreateTask";
import {EditTaskPage} from "./pages/EditTaskPage";

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/tasks" exact>
                <TasksPage />
            </Route>
            <Route path="/create" exact>
                <CreateTask />
            </Route>
            <Route path="/:id" exact>
                <EditTaskPage />
            </Route>
            <Redirect to="/tasks" />
        </Switch>
    )
}
