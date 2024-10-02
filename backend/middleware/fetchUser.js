const jwt = require('jsonwebtoken')
const JWT_Token=process.env.JWT_TOKEN;
const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')

    if(!token){
        res.status(400).json("Invalid or Null Token ! Enter correct Token.")
    }
    try {
        const data=jwt.verify(token,JWT_Token); 
        req.user=data.user;
        next();
        
    } catch (error) {
        res.status(400).json("Please try to enter the correct token")

    }

}
module.exports=fetchuser;