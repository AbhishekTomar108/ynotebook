var jwt = require("jsonwebtoken");

const JWT_SECRET = "mmm";

const fetchuser =(req, res, next)=>{
    // get the user from the jwt token and dd id to req object
    console.log("calling fetchuser");
    const token =  req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error:"please authenticate using valid token"});
    }
    try{
    const data = jwt.verify(token, JWT_SECRET);
    
    req.user = data.user;
    console.log(data,req.user);
    next();
    }
    catch(error){
        res.status(401).send("you are unauthorized"+error.message+" "+token);
    }
}
module.exports = fetchuser;