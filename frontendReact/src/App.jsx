import { useState } from 'react'
import SignIn from './SignIn'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
