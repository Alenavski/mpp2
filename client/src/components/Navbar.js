import React from 'react'
import {NavLink} from "react-router-dom"

export const Navbar = () => {

    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <span className="brand-logo">Task manager</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Create Task</NavLink></li>
                    <li><NavLink to="/tasks">Tasks</NavLink></li>
                    <li><NavLink to="/:id">Edit</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}