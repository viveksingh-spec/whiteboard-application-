import './App.css'
import Tollbar from './components/Toolbar'
import Toolbox from './components/Toolbox'
import Canvas from './components/Board/Index'
import { Loginsignup } from './components/Login&Register.jsx'
import RightSidebar from './components/RightSidebar'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
 
  return (
    <>
    <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <Loginsignup/>
      <RightSidebar />
      <Tollbar/>
      <Toolbox/>
      <Canvas/>
    </>
  )
}

export default App
