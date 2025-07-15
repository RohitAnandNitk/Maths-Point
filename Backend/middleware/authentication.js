const jwt = require('jsonwebtoken')
const secret_key = '$uperman1235';

function authMiddleware(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({msg: 'Unauthorized'});
    }

    try{
        const user = jwt.verify(token, secret_key);
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({msg: 'Unauthorized'});
    }
}

module.exports = authMiddleware;