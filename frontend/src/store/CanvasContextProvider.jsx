import React, { useReducer } from 'react'
import {canvascontext} from './CanvasHistory'
import { CANVAS_ACTION } from '../constants'



const CanvasReducer = (state,action)=>{
        switch (action.type) {
          case CANVAS_ACTION.SETACCESSTOKEN:{
              return {
                   ...state,
                   Accesstoken:action.payload.token
              }
          }
          case CANVAS_ACTION.SETLOGOPEN:
            return{
              ...state,
              logopen:action.payload.value
            }
          case CANVAS_ACTION.SET_SIDEBAR_OPEN:
            return {
              ...state,
              sidebarOpen: action.payload.value,
            }
          case CANVAS_ACTION.TOGGLE_SIDEBAR:
            return {
              ...state,
              sidebarOpen: !state.sidebarOpen,
            }
          case CANVAS_ACTION.CHANGECURRENTCANVAS:
            return {
              ...state,
              CurrentCanvas: action.payload?.canvasId || ""
            }
          default:
            return state;
        }
}
const token = localStorage.getItem("token")
const initialvalue = {
  Accesstoken:token||"",
  logopen:!token,
  sidebarOpen:false,
  CurrentCanvas:"",
}

const CanvasContextProvider = ({ children }) => {
  
  const [canvasstate,DispatchCanvasAction] = useReducer(
    CanvasReducer,
    initialvalue,
  )

  const setAccesstoken = (token)=>{
         DispatchCanvasAction({
         type:CANVAS_ACTION.SETACCESSTOKEN,
             payload:{
                token
             }
         })
  }

  const setlogopen = (value)=>{
        DispatchCanvasAction({
          type:CANVAS_ACTION.SETLOGOPEN,
          payload:{
            value
          }
        })
  }

  const setSidebarOpen = (value)=>{
        DispatchCanvasAction({
          type:CANVAS_ACTION.SET_SIDEBAR_OPEN,
          payload:{
            value
          }
        })
  }

  const toggleSidebar = ()=>{
        DispatchCanvasAction({
          type:CANVAS_ACTION.TOGGLE_SIDEBAR
        })
  }

  const SetCurrentCanvas = (canvasId)=>{
    if(!canvasId)return;
         DispatchCanvasAction({
          type:CANVAS_ACTION.CHANGECURRENTCANVAS,
          payload:{canvasId}
         })
  }

  const Canvasvalue = {
      logopen:canvasstate.logopen,
      Accesstoken:canvasstate.Accesstoken,
      sidebarOpen:canvasstate.sidebarOpen,
      CurrentCanvas:canvasstate.CurrentCanvas,
      setAccesstoken,
      setlogopen,
      setSidebarOpen,
      toggleSidebar,
      SetCurrentCanvas
  }
  return (
    <canvascontext.Provider value={Canvasvalue}>
      {children}
    </canvascontext.Provider>
  )
}

export default CanvasContextProvider