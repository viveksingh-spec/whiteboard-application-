import React, { useReducer } from 'react'
import ToolboxContext from './ToolBoxContext'
import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from '../constants';

const ToolReducre = (state,action)=>{
      switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE:
          return {
            ...state,
            [action.payload.tool]:{
                ...state[action.payload.tool],
                stroke: action.payload.color
            }
          }
        case TOOLBOX_ACTIONS.CHANGE_FILL:
          return {
             ...state,
              [action.payload.tool]:{
                ...state[action.payload.tool],
                fill: action.payload.color
            }
          }
        case TOOLBOX_ACTIONS.CHANGE_SIZE:
          return {
            ...state,
            [action.payload.tool]:{
              ...state[action.payload.tool],
              size:action.payload.size
            }
          }
        
        default:
            return state
      }
}

const initialState = {
       [TOOL_ITEMS.LINE]:{
        stroke:COLORS.BLACK,
        size:1
       },
       [TOOL_ITEMS.RECTANGLE]:{
        stroke:COLORS.BLACK,
        fill:null,
        size:1
       },
       [TOOL_ITEMS.CIRCLE]:{
        stroke:COLORS.BLACK,
        fill:null,
        size:1
       },
       [TOOL_ITEMS.ARROW]:{
        stroke:COLORS.BLACK,
        size:1
       },
       [TOOL_ITEMS.BRUSH]:{
        stroke:COLORS.BLACK,
        size:1
       },
       [TOOL_ITEMS.TEXT]:{
          stroke:COLORS.BLACK,
          size:16
       }
}
const ToolBoxProvider = ({children}) => {
    const [Toolboxstate,DispatchToolaction] = useReducer(
           ToolReducre,
           initialState
    );

    function ChangeStrokeColor(tool,color){
         DispatchToolaction({
             type:TOOLBOX_ACTIONS.CHANGE_STROKE,
             payload:{tool,color}
         })
    }

      function ChangeFillColor(tool,color){
         DispatchToolaction({
             type:TOOLBOX_ACTIONS.CHANGE_FILL,
             payload:{tool,color}
         })
    }

    function ChangeSize(tool,size){
         DispatchToolaction({
          type:TOOLBOX_ACTIONS.CHANGE_SIZE,
          payload:{tool,size}
         })
    }

    const Toolboxvalue = {
         Toolboxstate,
         ChangeStrokeColor,
         ChangeFillColor,
         ChangeSize
    }

  return (
    <ToolboxContext.Provider value={Toolboxvalue}>
        {children}
    </ToolboxContext.Provider>
  )
}

export default ToolBoxProvider