import React, { useContext, useState } from 'react'
import classess from './index.module.css'
import cx from "classnames"
import { FaArrowRight,
         FaEraser,
         FaFont,
         FaRegCircle, 
         FaSlash,
         FaPaintBrush,
         FaDownload,
         FaUndoAlt,
         FaRedoAlt,
        } from 'react-icons/fa';
import { RiRectangleLine } from "react-icons/ri";
import { TOOL_ITEMS } from '../../constants';
import { BoardContext } from '../../store/BoardContext';
const Tollbar = () => {
  const {activetoolitem,HandleToolItemClick,UndoHandler,RedoHandler} = useContext(BoardContext);

   function HandleDownload(){
         const canvas = document.getElementById("canvas")
         const data = canvas.toDataURL("image/png")
         const anchar = document.createElement("a")
         anchar.href = data
         anchar.download = "Board.png"
         anchar.click()
   }

  return (
    <>
    <div className={classess.container}>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.BRUSH)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.BRUSH})}><FaPaintBrush/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.LINE)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.LINE})}><FaSlash/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.RECTANGLE)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.RECTANGLE})}><RiRectangleLine/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.CIRCLE)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.CIRCLE})}><FaRegCircle/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.ARROW)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.ARROW})}><FaArrowRight/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.TEXT)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.TEXT})}><FaFont/></div>
    <div onClick={()=>HandleToolItemClick(TOOL_ITEMS.ERASER)} className={cx(classess.items,{[classess.active]:activetoolitem===TOOL_ITEMS.ERASER})}><FaEraser/></div>
    <div onClick={HandleDownload} className={cx(classess.items)}><FaDownload/></div>
    <div onClick={()=>{UndoHandler()}}  className={cx(classess.items)}><FaUndoAlt/></div>
    <div onClick={()=>{RedoHandler()}} className={cx(classess.items)}><FaRedoAlt/></div>
    </div>
    </>
  )
}

export default Tollbar