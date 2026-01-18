

export const successResponse = (res,code,message,data={})=>{
       return res.status(code).json({
            success:true,
            message,
            data
       })
}

export const errorResponse = (res,code,message,data={})=>{
       return res.status(code).json({
            success:false,
            message,
            data
       })
}

