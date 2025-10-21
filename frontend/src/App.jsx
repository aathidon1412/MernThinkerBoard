import React from 'react'
import { Routes,Route } from 'react-router'
import { toast } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import NoteDetailPage from './pages/NoteDetailPage'
import CreatePage from './pages/CreatePage'

const App = () => {
  return (
    <div data-theme="forest">
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/note/:id' element={<NoteDetailPage/>}></Route>
            <Route path='/create' element={<CreatePage/>}></Route>
        </Routes>
    </div>
  )
}

export default App