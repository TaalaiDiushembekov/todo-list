import React, { useState } from 'react'
import { button } from '@storybook/addon-knobs'
import { Link } from 'react-router-dom'
import TimeSpan from './timespan'
import back from '../assets/images/back.png'
import { history } from '../redux'
import TaskListItem from './task-list-item'

const TaskList = ({ tasks, addTasks, switchStatus, deleteTask, setTimespan,saveTask }) => {
  const [taskInput, setTaskInput] = useState('')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      history.push(addTasks(taskInput))
    }
  }
  return (
    <div>
      <Link to="/">
        <img src={back} width="30px" alt="" />
      </Link>
      <h2 className="font-mono text-2xl text-center font-normal">Tasks</h2>
      <TimeSpan setTimespan={setTimespan} />
      {tasks.map((task) => (
        <TaskListItem
          key={task.taskId}
          task={task}
          switchStatus={switchStatus}
          deleteTask={deleteTask}
          saveTask={saveTask}
        />
      ))}
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="New task"
          onKeyDown={handleKeyDown}
          onChange={(e) => setTaskInput(e.target.value)}
          className="rounded-lg border shadow-lg bg-gray-200"
        />
        <button
          type="button"
          onClick={() => addTasks(taskInput)}
          className="text-green-800 px-2 text-3xl"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TaskList
