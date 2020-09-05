import React, { useState } from 'react'
import { button } from '@storybook/addon-knobs'
import { Link } from 'react-router-dom'
import TimeSpan from './timespan'
import back from '../assets/images/back.png'
import { history } from '../redux'

const TaskList = ({ tasks, addTasks, switchStatus, deleteTask, setTimespan }) => {
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
        <div key={task.taskId} className="flex justify-between py-1 font-bold">
          {task.title}
          {task.status === 'new' && (
            <button
              type="button"
              onClick={() => switchStatus(task.taskId, 'in progress')}
              className=" border border-solid border-2 rounded  border-green-400 text-green-400 px-1"
            >
              in progress
            </button>
          )}
          {task.status === 'in progress' && (
            <div >
              <button
                type="button"
                onClick={() => switchStatus(task.taskId, 'blocked')}
                className=" border border-solid border-2 rounded  border-black px-1"
              >
                blocked
              </button>
              <button
                type="button"
                onClick={() => switchStatus(task.taskId, 'done')}
                className=" border border-solid border-2 rounded  border-blue-400 text-blue-400 ml-1 px-1"
              >
                Done
              </button>
            </div>
          )}
          {task.status === 'done' && (
            <button
              type="button"
              className=" border border-solid border-2 rounded  border-red-400 text-red-400 px-1"
              onClick={() => deleteTask(task.taskId)}
            >
              delete
            </button>
          )}
          {task.status === 'blocked' && (
            <button
              type="button"
              className=" border border-solid border-2 rounded  border-yellow-400 text-yellow-400 px-1"
              onClick={() => switchStatus(task.taskId, 'in progress')}
            >
              Unblock
            </button>
          )}
        </div>
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
