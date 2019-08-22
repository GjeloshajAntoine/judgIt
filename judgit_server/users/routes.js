const router = require('express').Router();
const uuidv4 = require('uuid/v4');
const userModelInit = require('./model')

module.exports = function (db) {
    
    const userModel = userModelInit(db)

    router.get('/token',(req,res)=>{
        if (req.cookies.token_user_extension) {
            res.json({msg:'already connected'})
        }else {
            let token = uuidv4()
            res.cookie('token_user_extension', token);
            userModel.createUserWithExtensionToken(token)
            res.json({msg:'cookie has been set'})
        }
    })

    return router;
}