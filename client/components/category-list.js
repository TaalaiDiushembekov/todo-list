import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { button } from '@storybook/addon-knobs'
import { history } from '../redux'
import trash from '../assets/images/erase.png'

const CategoryList = ({ categories, addCategory, deleteCategory }) => {
  const [categoryInput, setCategoryInput] = useState('')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      history.push(addCategory(categoryInput))
    }
  }

  return (
    <div>
      <h2 className="font-mono text-2xl text-center font-normal">Categories</h2>
      {categories.map((category, index) => (
        <div key={index} className=" flex justify-between py-1 font-bold">
          <Link to={`/${category}`}>{category[0].toUpperCase() + category.slice(1)}</Link>
          <button type="button" onClick={() => deleteCategory(category)}>
            <img src={trash} alt="" width="20px" />
          </button>
        </div>
      ))}
      <div className=" flex items-center justify-center">
        <input
          type="text"
          placeholder="New category"
          onKeyDown={handleKeyDown}
          onChange={(e) => setCategoryInput(e.target.value)}
          className="rounded-lg border shadow-lg bg-gray-200"
        />
        <button
          type="button"
          onClick={() => addCategory(categoryInput)}
          className="text-green-800 px-2 text-3xl"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default CategoryList
