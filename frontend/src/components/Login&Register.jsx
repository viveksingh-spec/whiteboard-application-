import { useContext, useState } from "react"
import {assets} from "../assets/assets.js"
import {toast} from "react-toastify"
import { canvascontext } from "../store/CanvasHistory.js"
import { apiClient } from "../utils/apiClient.js"
export const Loginsignup = () => {
  const [state, setstate] = useState("Login")
  const [name,setname] = useState('')
  const [email,setemail] = useState('')
  const [password,setpassword] = useState('')

  const {logopen,Accesstoken,setAccesstoken,setlogopen} = useContext(canvascontext)

  const onsubmithandler = async(e) => {
          e.preventDefault();
          try {
            if(state==='Login'){
                try {
                   const {data} = await apiClient.post('/user/login',{email,password})
                   if(data.success){
                       setAccesstoken(data.data.access_token)
                       localStorage.setItem('token',data.data.access_token)
                       setlogopen(false)
                       toast.success(`${state} successful!`)
                   }
                } catch (error) {
                    console.log(error)
                  toast.error('Something went wrong!!');
                }
            }else{
              try {
                   const {data} = await apiClient.post('/user/register',{username:name,email,password})
                   console.log(data)
                   if(data.success){
                       toast.success(`${state} successful!`);
                       setstate("Login")
                   }
                } catch (error) {
                  toast.error(error?.response?.data?.message || 'Something went wrong');
                }
            }
          } catch (error) {
            console.log("is it going there",error)
             toast.error(error.response?.data?.message || error.message);
          }
  }

  return (
    <div
      className={`fixed inset-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center transition-all duration-300 ${
        logopen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setlogopen(false)}
    >
      <form onSubmit={onsubmithandler}
        className="relative bg-white p-10 rounded-xl z-20 text-slate-500"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>
        <p className="text-sm text-center mb-4">Please sign up to continue</p>

        {state === "Sign up!" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-2">
            <img src={assets.profile_icon} className="w-4 invert-10" alt="profile" />
            <input onChange={e=>setname(e.target.value)} value={name} className="outline-none text-sm" type="text" placeholder="Full name" />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="email" />
          <input onChange={e=>setemail(e.target.value)} value={email} className="outline-none text-sm" type="email" placeholder="Email" />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="lock" />
          <input onChange={e=>setpassword(e.target.value)} value={password} className="outline-none text-sm" type="password" placeholder="Password" />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer text-right">Forgot password?</p>

        <button className="bg-blue-600 text-white py-2 rounded-full text-center w-full cursor-pointer">
          {state === "Login" ? "Login" : "Create account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => setstate("Sign up!")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up!
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => setstate("Login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt="close"
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setlogopen(false)}
        />
      </form>
    </div>
  )
}
