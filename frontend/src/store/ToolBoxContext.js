import { createContext } from "react";

const ToolboxContext = createContext({
    Toolboxstate:{},
    ChangeStrokeColor:()=>{},
    ChangeFillColor:()=>{},
    ChangeSize:()=>{},
    
})

export default ToolboxContext