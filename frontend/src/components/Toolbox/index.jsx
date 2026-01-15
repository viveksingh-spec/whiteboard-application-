import React, { useContext } from 'react'
import  cx from "classnames"
import classess from "./index.module.css"
import { COLORS, FILL_TOOL_TYPES, SIZE_TOOL_TYPES, STROKE_TOOL_TYPES, TOOL_ITEMS } from '../../constants'
import { BoardContext } from '../../store/BoardContext'
import ToolboxContext from '../../store/ToolBoxContext'

const Toolbox = () => {
   const {activetoolitem} = useContext(BoardContext)
   const {Toolboxstate,ChangeStrokeColor,ChangeFillColor,ChangeSize} = useContext(ToolboxContext)
   
   const stroke_color = Toolboxstate[activetoolitem]?.stroke;
   const fill_color = Toolboxstate[activetoolitem]?.fill;
   const size = Toolboxstate[activetoolitem]?.size;

  return (
    <div className={classess.container}>

        {STROKE_TOOL_TYPES.includes(activetoolitem) && <div className={classess.selectOptionContainer}>
           <div className={classess.toolBoxLabel}>
                 stroke 
           </div>
           <div className={classess.colorsContainer}>
            <div>
              <input
                className={classess.colorPicker}
                type="color"
                value={stroke_color}
                onChange={(e) => ChangeStrokeColor(activetoolitem, e.target.value)}
              ></input>
            </div>

               {Object.keys(COLORS).map((c,idx)=>(
                 <div key={idx} className={cx(classess.colorBox,{[classess.activeColorBox]:stroke_color===COLORS[c]})}
                  style={{backgroundColor:COLORS[c]}}
                  onClick={()=>ChangeStrokeColor(activetoolitem,COLORS[c])}
                  ></div>
               ))}
           </div>
        </div>}

        

        {FILL_TOOL_TYPES.includes(activetoolitem) && <div className={classess.selectOptionContainer}>
           <div className={classess.toolBoxLabel}>
                 Fill
           </div>

            
           <div className={classess.colorsContainer}>  
           <div
              className={cx(classess.colorBox, classess.noFillColorBox, {
                [classess.activeColorBox]: fill_color === null,
              })}
              onClick={() => ChangeFillColor(activetoolitem, null)}
            ></div>

               {Object.keys(COLORS).map((c,idx)=>(
                 <div key={idx} className={cx(classess.colorBox,{[classess.activeColorBox]:fill_color===COLORS[c]})}
                  style={{backgroundColor:COLORS[c]}}
                  onClick={()=>ChangeFillColor(activetoolitem,COLORS[c])}
                  ></div>
               ))}
           </div>
        </div>}

        {SIZE_TOOL_TYPES.includes(activetoolitem) && <div className={classess.selectOptionContainer}>
           <div className={classess.toolBoxLabel}>
                 {activetoolitem===TOOL_ITEMS.TEXT?"Text size":"Brush size"}
           </div>
           <input
           type="range"
           min={activetoolitem === TOOL_ITEMS.TEXT ? 12 : 1}
           max={activetoolitem === TOOL_ITEMS.TEXT ? 64 : 10}
           step={1}
           size={size}
           onChange={(e)=>{ChangeSize(activetoolitem,e.target.value)}}
            />
        </div>}

    </div>
  )
}

export default Toolbox