import { useContext, useEffect, useRef, useState } from "react";
import { canvascontext } from "../../store/CanvasHistory";
import { MdDelete } from "react-icons/md";
import { BoardContext } from "../../store/BoardContext";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/apiClient.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function RightSidebar() {
  const {
    Accesstoken,
    logopen,
    CurrentCanvas,
    sidebarOpen,
    setlogopen,
    setSidebarOpen,
    toggleSidebar,
    setAccesstoken,
    SetCurrentCanvas,
  } = useContext(canvascontext);

  const { SetelementsOnApicall,elements } = useContext(BoardContext);

  const skipNextSaveRef = useRef(false);

  const [allcanvas, setallcanvas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const isLoggedIn = Boolean(Accesstoken);
  const closeSidebar = () => setSidebarOpen(false);
  
  const fetchAllCanvas = async () => {
      if (!sidebarOpen || !isLoggedIn) return;
      if (!backendUrl) {
        setLoadError("Missing VITE_BACKEND_URL");
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const { data } = await apiClient.get(`/canvas/getall`);
        if (data?.success) {
          setallcanvas(Array.isArray(data.data) ? data.data : []);
        } else {
          setLoadError(data?.message || "Failed to load canvases");
        }
      } catch (error) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to load canvases";
        setLoadError(message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAllCanvas();
  }, [sidebarOpen, isLoggedIn, Accesstoken]);

  
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen, setSidebarOpen]);



  const onButtonClick = () => {
    if (!isLoggedIn) {
      setSidebarOpen(false);
      setlogopen(true);
      return;
    }
    if(logopen) setlogopen(false);
    toggleSidebar();
  };

  const HandleLogout = ()=>{
        localStorage.removeItem("token");
        setAccesstoken("");
        setlogopen(true);
        setSidebarOpen(false);
  }

  const HandleDelete = async(canvasId)=>{
        try {
            const { data } = await apiClient.delete(`/canvas/delete/${canvasId}`);
            if(data.success){
                  fetchAllCanvas();
                  toast.success(data.message || "canvas deleted successfully")
            }

        } catch (error) {
            toast.error("something went wrong!")
        }
  }

  const HandleCreateCanvas = async()=>{
       try {
            const { data } = await apiClient.post(`/canvas/create`,{});
            if(data.success){
                 fetchAllCanvas();
                 toast.success(data.message || "canvas successfully created")
            }
       } catch (error) {
           toast.error("something went wrong!!")
       }
  }

  const handleSelectCanvas = (canvas) => {
    if (!canvas?._id) return;
    skipNextSaveRef.current = true;
    SetCurrentCanvas(canvas._id);
    SetelementsOnApicall(Array.isArray(canvas?.elements) ? canvas.elements : []);
    setSidebarOpen(false);
  };

  useEffect(()=>{
      if (!backendUrl) return;
      if (!isLoggedIn) return;
      if (!CurrentCanvas) return;

      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false;
        return;
      }

      const controller = new AbortController();
      const debounceMs = 800;

      const timeoutId = setTimeout(async () => {
        try {
          await apiClient.put(
            `/canvas/update`,
            {
              canvasId: CurrentCanvas,
              elements,
            },
            {
              signal: controller.signal,
            }
          );
        } catch (error) {
          if (error?.name !== "CanceledError") {
            console.error(error);
          }
        }
      }, debounceMs);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
  },[elements, CurrentCanvas, Accesstoken, isLoggedIn, backendUrl])

  return (
    <>
      <button
        type="button"
        onClick={onButtonClick}
        className="fixed right-14 top-8 -translate-y-1/2 z-50 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700 active:bg-blue-800 font-semibold"
        aria-label={isLoggedIn ? "Open sidebar" : "Login"}
      >
        {isLoggedIn ? "Canvases" : "Login"}
      </button>

      {isLoggedIn && sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          <aside
            className="absolute right-0 top-0 h-full w-[30vw] min-w-[320px] bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Sidebar"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <button
                type="button"
                onClick={HandleLogout}
                className="rounded-md bg-red-600 px-3 py-1.5 text-white shadow hover:bg-red-700 active:bg-red-800 font-semibold"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={closeSidebar}
                className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            <div className="p-4 text-slate-600">
                  <button 
                  className="bg-blue-600 p-2 w-full rounded-2xl text-white font-semibold"
                  onClick={()=>HandleCreateCanvas()}
                  >Create Canvas</button>

                  <div className="overflow-y-scroll">
                    
                    {
                    allcanvas.map((element,idx)=>(
                            <div 
                            key={idx}
                            className={`flex justify-between p-2 border-2 shadow-2xl text-xl m-3 rounded-2xl border-gray-100 cursor-pointer hover:bg-amber-50 ${CurrentCanvas===element._id ? "text-blue-400" : ""}`}
                            onClick={()=>handleSelectCanvas(element)}
                            >
                                <p>Canvas {idx+1}</p>
                                <MdDelete 
                                onClick={(e)=>{
                                  e.stopPropagation();
                                  HandleDelete(element._id)
                                }}
                                className="hover:text-red-600"/>

                            </div>
                        ))
                    }

                    {loading ? "Loading..." : null}
                    {!loading && loadError ? loadError : null}
                  </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
