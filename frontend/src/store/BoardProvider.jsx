import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants';
import GenRoughElements from '../utils/Elemenst';
import {BoardContext} from './BoardContext'
import { useCallback, useContext, useReducer,} from 'react';
import ToolboxContext from './ToolBoxContext';
import { EraseElements } from '../utils/Elemenst';

const BoardReducre = (state,action)=>{
         switch (action.type) {
          case BOARD_ACTIONS.CHANGE_TOOL:
             return {
                ...state,
                activetoolitem :action.payload.tool,
             }

          case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
            return{
               ...state,
               ToolActionType:action.payload.actiontype
            }
          case BOARD_ACTIONS.DRAW_DOWN:
            {
            const {clientX,clientY,stroke,fill,size} = action.payload;
            const nextele = GenRoughElements(state.elements.length,clientX,clientY,clientX,clientY,{type:state.activetoolitem,stroke,fill,size})
            const prev = state.elements;
            return {
              ...state,
              ToolActionType: state.activetoolitem===TOOL_ITEMS.TEXT ?  TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
              elements:[...prev,nextele],
              undoElements:[]
            }}
          case BOARD_ACTIONS.DRAW_MOVE:
            {
              const {clientX,clientY,stroke,fill,size} = action.payload
              const newele = [...state.elements]
              const index = newele.length-1
              const {x1,y1,type} = newele[index]
              if(type===TOOL_ITEMS.BRUSH){
                 const updatedele = {
                      ...newele[index],
                      points: [...newele[index].points,{x:clientX,y:clientY}]
                 }
                  newele[index] = updatedele
                  return{
                    ...state,
                    elements:newele
                  }
              }
              else{
                newele[index] = GenRoughElements(index,x1,y1,clientX,clientY,{type:state.activetoolitem,stroke,fill,size})
                return {
                     ...state,
                     elements:newele
                }
              }
            }
            case BOARD_ACTIONS.DRAW_UP:
               { 
                 return{
                    ...state,
                    ToolActionType : action.payload.actiontype
                 }
                }
            case BOARD_ACTIONS.ERASE:
              const {clientX,clientY} = action.payload
              let newelement = [...state.elements]
              newelement = newelement.filter((element)=>{
               return !EraseElements(element,clientX,clientY)
              })
              return {
                ...state,
                elements:newelement
              }
            case BOARD_ACTIONS.CHANGE_TEXT:{
              const newele = [...state.elements]
              const index = newele.length-1
              newele[index].text = action.payload.newtext
              return{
                ...state,
                elements:newele,
                ToolActionType:TOOL_ACTION_TYPES.NONE
              }}
            case BOARD_ACTIONS.UNDO:
              const newele = [...state.elements]
              if(newele.length===0)return state;
              const index = newele.length-1
              const lastele = newele[index]
              const newundoele = [...state.undoElements,lastele]
              newele.pop()
              return{
                 ...state,
                 elements:newele,
                 undoElements:newundoele,
              }
            case BOARD_ACTIONS.REDO:{
               const newredo = [...state.undoElements]
               if(newredo.length===0){
                return state;
               }
               const redoele = newredo[newredo.length-1]
               newredo.pop()
               const newele = [...state.elements,redoele]
              return{
                 ...state,
                 elements:newele,
                 undoElements:newredo,
              }
            }
          case BOARD_ACTIONS.ONREFRESH:{
             return{
                   ...state,
                   elements: Array.isArray(action.payload.value)
                     ? action.payload.value.filter(
                         (el) => el && typeof el === "object" && "type" in el
                       )
                     : []
             }
          }
          case BOARD_ACTIONS.SETONAPICALL:{
            return{
                ...state,
                elements: Array.isArray(action.payload.newelements)
                  ? action.payload.newelements.filter(
                      (el) => el && typeof el === "object" && "type" in el
                    )
                  : []
            }
          }

          default:
            return state;
         }
}


  const initialState = {
        activetoolitem : TOOL_ITEMS.BRUSH,
        elements : [],
        ToolActionType:TOOL_ACTION_TYPES.NONE,
        undoElements:[]
}


export const BoardProvider = ({children}) => {

  const {Toolboxstate} = useContext(ToolboxContext)
  const [BoardState , DispatchBoardAction] = useReducer(
    BoardReducre,
    initialState
  );

  const HandleToolItemClick = (tool)=>{
          DispatchBoardAction({
            type:BOARD_ACTIONS.CHANGE_TOOL,
            payload:{
              tool,
            }
          })
  }

  const HandleMouseDown = (e)=>{
     if(BoardState.ToolActionType===TOOL_ACTION_TYPES.WRITING)return;
      const {clientX,clientY} = e;
      if(BoardState.activetoolitem === TOOL_ITEMS.ERASER){
        DispatchBoardAction({
          type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
          payload:{
            actiontype:TOOL_ACTION_TYPES.ERASING
          }
        })
        DispatchBoardAction({
          type:BOARD_ACTIONS.ERASE,
          payload:{
              clientX,
              clientY
          }
        })
        return;
        }
         DispatchBoardAction({
           type:BOARD_ACTIONS.DRAW_DOWN,
           payload:{
               clientX,
               clientY,
               stroke:Toolboxstate[BoardState.activetoolitem]?.stroke,
               fill:Toolboxstate[BoardState.activetoolitem]?.fill,
               size:Toolboxstate[BoardState.activetoolitem]?.size
           }
         })
  }

  const HandleMouseMove = (e)=>{
     if(BoardState.ToolActionType===TOOL_ACTION_TYPES.WRITING)return;
        const {clientX,clientY} = e
        if(BoardState.ToolActionType===TOOL_ACTION_TYPES.DRAWING){
          DispatchBoardAction({
            type:BOARD_ACTIONS.DRAW_MOVE,
            payload:{
              clientX,
              clientY,
              stroke:Toolboxstate[BoardState.activetoolitem]?.stroke,
              fill:Toolboxstate[BoardState.activetoolitem]?.fill,
              size:Toolboxstate[BoardState.activetoolitem]?.size
            }
          })
        }
        else if(BoardState.ToolActionType===TOOL_ACTION_TYPES.ERASING){
            DispatchBoardAction({
                type:BOARD_ACTIONS.ERASE,
                payload:{
                  clientX,
                  clientY
                }
            })
        }
  }
  const HandleMouseUp = ()=>{
       if(BOARD_ACTIONS.ToolActionType===TOOL_ACTION_TYPES.WRITING)return;
       DispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload:{actiontype:TOOL_ACTION_TYPES.NONE}
      });
  }

  function HandleTextOnblur(text){
      DispatchBoardAction({
        type:BOARD_ACTIONS.CHANGE_TEXT,
        payload:{
          newtext:text
        }
      })
  }


  const UndoHandler = useCallback(()=>{
     DispatchBoardAction({type:BOARD_ACTIONS.UNDO})
  },[])



  const RedoHandler = useCallback(()=>{
     DispatchBoardAction({type:BOARD_ACTIONS.REDO})
  },[])
 

  const SetElementsOnRefresh = (value)=>{  // function 
          DispatchBoardAction({
            type:BOARD_ACTIONS.ONREFRESH,
            payload:{
              value:value
            }
          })
  }

const SetelementsOnApicall = (newelements)=>{
      DispatchBoardAction({
            type:BOARD_ACTIONS.SETONAPICALL,
            payload:{
                newelements
            }
      })
}

  const  BoardContextValue = {
         HandleToolItemClick,
         activetoolitem:BoardState.activetoolitem,
         elements:BoardState.elements,
         HandleMouseDown,
         HandleMouseMove,
         ToolActionType:BoardState.ToolActionType,
         HandleMouseUp,
         HandleTextOnblur,
         UndoHandler,
         undoElements:BoardState.undoElements,
         RedoHandler,
         SetElementsOnRefresh,
         SetelementsOnApicall
  }


  return  (
      <BoardContext.Provider value={BoardContextValue}>
         {children}
      </BoardContext.Provider>
  );
}