import { createContext } from "react";

export const BoardContext = createContext({
            activetoolitem : "",
            elements : [],
            undoElements:[],
            ToolActionType : "",
            SetElementsOnRefresh:()=>{},
            RedoHandler:()=>{},
            SetelementsOnApicall:()=>{}
});