const userModelInit = require('./model')
module.exports =  function (db)  {
    const userModel = userModelInit(db)
    return {
        connected : function (req,res, next)  {
            let token = req.cookies.token_user_extension
            userModel.getUserIdByExtensionToken(token)
            .then(userId=>{
                if (userId) {
                    res.locals.user = {id: userId}
                    next()
                } else {
                    res.status(400).json({error:true,msg:'not connected'})
                }
            })
        },
        connectedOptional : function (req,res, next) {
            let token = req.cookies.token_user_extension
            userModel.getUserIdByExtensionToken(token)
            .then(userId=>{
                res.locals.user = {id: userId}
                next()
            })
        }
    }
}