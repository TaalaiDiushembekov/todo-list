import React, { useState } from 'react'
import { button } from '@storybook/addon-knobs'
import pencil from '../assets/images/pencil.png'
import save from '../assets/images/save.png'

const TaskListItem = ({ task, switchStatus, deleteTask ,saveTask}) => {
  const [editingMode, setEditingMode] = useState(false)
  const [taskName, setTaskName] = useState(task.title)
  const handleTask =() =>{
    saveTask(taskName,task.taskId)
    setEditingMode(false)

  }
  return (
    <div className="flex justify-between py-1 font-bold">
      {!editingMode ? (
        <button type="button" onClick={() => setEditingMode(true)}>
          <img src={pencil} alt="" width="15px" />
        </button>
      ) : (
        <button type="button" onClick={handleTask}>
          <img src={save} alt="" width="15px" />
        </button>
      )}
      {!editingMode ? (
        task.title
      ) : (
        <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="border border-gray-400 rounded" />
      )}
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
        <div>
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
  )
}

export default TaskListItem
