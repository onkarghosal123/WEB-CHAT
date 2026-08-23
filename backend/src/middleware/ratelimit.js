import aj from "../lib/arcjet.js"
export const rateLimit = async (req, res, next) => {
 try {
       const decision = await aj.protect(req);
       console.log("decision:",decision);
       if (decision.isDenied()) {
           return res.status(429).json({
               message: "Too many requests. Please try again later."
           });
       }
       next();
 } catch (error) {
    console.log("error in arcjet",error);
    res.status(400).json({message:"internal server error"})
 }
}

