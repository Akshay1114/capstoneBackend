import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js";

dotenv.config();

const verifyToken =async(req, res,next)=> {
  try {
    console.log("verification start for  token")
    // let jwtSecretKey = "gfg_jwt_secret_key";
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    try {
      // console.log(req)
      let verifyToken = req.headers.authorization;
      console.log(req.headers.authorization)
       let token = verifyToken?.replace(/^Bearer\s+/, "");
       const verified = jwt.verify(token, jwtSecretKey);
       console.log("veification ===> ")
        if(verified){
          console.log(verified)
          let decoded_token = jwt.decode(token,jwtSecretKey)
          // const user = await User.findById(decoded.id); 
          const user = await User.findOne({email:decoded_token.email})
          console.log("USERm==>",user)
          if(!user){
            return res.status(401).send({message:"User not found"});
          }
          console.log(decoded_token)
        //   let  shop = decoded_token.shop
          
        //   let  customer_access_token = decoded_token.customer_access_token
        //   let  customer_mail = decoded_token.customer_mail
        //   let  customer_id = decoded_token.customer_id
        //   req.session = {
        //     shop: shop,
        //     customer_access_token: customer_access_token,
        //     customer_mail,
        //     customer_id
        //   }
           next();
        }else{
          console.log("enter in else")
            return res.status(401).send(error);
        }
    } catch (error) {
      console.log("enter in CATCH==>", error)
        return res.send({code:500, message:'You must be login', err: error});
    }
  } catch (err) {
    console.log(err.message);
  }
}

export { verifyToken };