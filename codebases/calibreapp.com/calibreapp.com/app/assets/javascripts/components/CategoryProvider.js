import React, { useState, useEffect } from 'react'

import CategoryContext from './CategoryContext'

const CategoryProvider = ({ children, initialState }) => {
  const [categories, setCategories] = useState(initialState)
  const value = { categories, setCategories }

  useEffect(() => {
    setCategories(initialState)
  }, [initialState])

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
}

export default CategoryProvider
