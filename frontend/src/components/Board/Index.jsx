import { useContext, useEffect,useRef } from 'react'
import rough from "roughjs/bundled/rough.esm";
import { BoardContext } from '../../store/BoardContext';
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from '../../constants';
import { getSvgPathFromStroke } from '../../utils/Elemenst';
import getStroke from 'perfect-freehand';
import classess from "./index.module.css"
function Canvas() {

  const canvasref = useRef();
  const textref = useRef();
  const isFirstRender = useRef(true)
  const {elements,HandleMouseDown,HandleMouseMove,ToolActionType,HandleMouseUp,HandleTextOnblur,UndoHandler,RedoHandler,SetElementsOnRefresh} = useContext(BoardContext);
 

  useEffect(()=>{
      const textarea = textref.current
      if(ToolActionType===TOOL_ACTION_TYPES.WRITING){
        setTimeout(() => {
          textarea.focus()
        }, 0);
      }
  },[ToolActionType])

  useEffect(()=>{
      const canvas = canvasref.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const roughcanvas = rough.canvas(canvas);

      const context = canvas.getContext("2d");
      context.save();
      
      elements.forEach(element => {
          switch (element.type) {
            case TOOL_ITEMS.LINE:
            case TOOL_ITEMS.ARROW:
            case TOOL_ITEMS.CIRCLE:
            case TOOL_ITEMS.RECTANGLE:
                roughcanvas.draw(element.roughEle);
                break;
            case TOOL_ITEMS.BRUSH:
                context.fillStyle = element.stroke;
                const path = new Path2D(getSvgPathFromStroke(getStroke(element.points)));
                context.fill(path);
                context.restore();
                 break;
            case TOOL_ITEMS.TEXT:
              context.textBaseline = "top";
              context.font = `${element.size}px Caveat`;
              context.fillStyle = element.stroke;
              context.fillText(element.text, element.x1, element.y1);
              context.restore();
                break;
            default:
              return;  
          }
      });

      return ()=>{
           context.clearRect(0,0,canvas.height,canvas.width)
      }

  },[elements])

function mousedownhandler(event){
      HandleMouseDown(event)
}

function mousemovehandler(event){
         if(ToolActionType===TOOL_ACTION_TYPES.DRAWING ||ToolActionType===TOOL_ACTION_TYPES.ERASING){
              HandleMouseMove(event)
         }
}

function mouseuphandler(){
        HandleMouseUp()
}

function OnBlureTextHandler(text){
      HandleTextOnblur(text)
}



useEffect(()=>{
      function Handlekeydown(event){
         
            if(event.ctrlKey && event.key==='z'){
                 UndoHandler();
            }
            else if(event.ctrlKey && event.key==='y'){
                 RedoHandler();
            }
      }
      document.addEventListener("keydown",Handlekeydown);

      return ()=> document.removeEventListener("keydown",Handlekeydown)
},[UndoHandler,RedoHandler])

useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  localStorage.setItem(
    "canvaselements",
    JSON.stringify(elements)
  );
}, [elements]);

useEffect(()=>{
     const canvasele = localStorage.getItem("canvaselements")
     if(canvasele){
         SetElementsOnRefresh(JSON.parse(canvasele))
     }
},[])

  return (
     
    <>
    {ToolActionType===TOOL_ACTION_TYPES.WRITING && 
    <textarea
    ref={textref}
    type="text"
    className={classess.textElementBox}
    style={{
      top:elements[elements.length-1].y1,
      left:elements[elements.length-1].x1,
      color:`${elements[elements.length-1]?.stroke}`,
      fontSize:`${elements[elements.length-1]?.size}px`
    }}
    onBlur={(e)=>{OnBlureTextHandler(e.target.value)}}
    
     >
    </textarea>
    }
    <canvas ref={canvasref} id='canvas'
    onMouseDown={mousedownhandler}
    onMouseMove={mousemovehandler}
    onMouseUp={mouseuphandler}
    />
    </>
  )
}

export default Canvas
