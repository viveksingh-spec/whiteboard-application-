import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BoardProvider } from './store/BoardProvider.jsx'
import ToolBoxProvider from './store/ToolBoxProvider.jsx'
import CanvasContextProvider from './store/CanvasContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <CanvasContextProvider>
    <ToolBoxProvider>
      <BoardProvider>
            <App/>
      </BoardProvider>
   </ToolBoxProvider>
   </CanvasContextProvider>
)
