import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import{ Routes, Route} from 'react-router-dom'
import Login from "./pages/Login";
import Experiences from "./pages/Experiences";
import PrivateRoute from './routes/PrivateRoute';


function App() {
  return(

    
 <Routes>
            
      <Route path="/login" element={<Login />} />
          
      <Route
        path="/experiences"
        element={
          <PrivateRoute>
            <Experiences/>
          </PrivateRoute>
        }
      />
      
    </Routes>

  );
}




export default App
