import { createContext } from "react";

export const canvascontext = createContext({
        logopen:false,
        Accesstoken:"",
        sidebarOpen:false,
        CurrentCanvas:"",
        setAccesstoken:()=>{},
        setlogopen:()=>{},
        setSidebarOpen:()=>{},
        toggleSidebar:()=>{},
        SetCurrentCanvas:()=>{}
})
