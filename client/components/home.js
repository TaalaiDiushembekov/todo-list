import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Route, useParams } from 'react-router-dom'
import Head from './head'
import CategoryList from './category-list'
import TaskList from './tasks-list'
import bg from '../assets/images/olivebg.jpg'

const Home = () => {
  const { category } = useParams()
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    axios('/api/v1/categories').then(({ data }) => setCategories(data))
    if (category) {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTasks(data))
    }
  }, [])

  const addTasks = (newTask) => {
    axios
      .post(`/api/v1/tasks/${category}`, { title: newTask })
      .then(({ data }) => setTasks([...tasks, data.newTask]))
  }

  const addCategory = (newCategory) => {
    axios.post(`/api/v1/tasks/${newCategory}`)
    setCategories([...categories, newCategory])
  }

  const switchStatus = (id, status) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
    setTasks(tasks.map((el) => (el.taskId === id ? { ...el, status } : el)))
  }
  const deleteTask = (id) => {
    axios.delete(`/api/v1/tasks/${category}/${id}`)
    setTasks(tasks.filter((el) => el.taskId !== id))
  }
  const setTimespan = (timespan) => {
    if (timespan === undefined) {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTasks(data))
    } else {
      axios.get(`/api/v1/tasks/${category}/${timespan}`).then(({ data }) => setTasks(data))
    }
  }

  const deleteCategory = (categor) => {
    axios.delete(`/api/v1/categories/${categor}`)
    setCategories(categor)
  }
  const saveTask = (TaskName,id) =>{
    axios
        .post(`/api/v1/tasks/${category}/${id}`, { title: TaskName })
    setTasks(tasks.map((el) => (el.taskId === id ? { ...el, title:TaskName } : el)))

  }

  return (
    <div>
      <Head title="Hello" />
      <img src={bg} alt="bac" className="absolute z-0 h-screen w-full " />
      <h1 className="relative text-center font-mono text-4xl pt-32 pb-2">Your to do list</h1>
      <div className="flex items-center justify-center  z-1 relative ">
        <div className=" sm:p-5 bg-white md:bg-white rounded-lg border shadow-lg p-10">
          <Route
            exact
            path="/"
            component={() => (
              <CategoryList
                categories={categories}
                addCategory={addCategory}
                deleteCategory={deleteCategory}
              />
            )}
          />
          <Route
            exact
            path="/:category"
            component={() => (
              <TaskList
                tasks={tasks}
                addTasks={addTasks}
                switchStatus={switchStatus}
                deleteTask={deleteTask}
                setTimespan={setTimespan}
                saveTask={saveTask}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default Home
