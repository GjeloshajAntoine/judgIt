const userModelInit = require('./model')
module.exports = async function (db)  {
    const userModel = userModelInit(db)
    return {
        connected : function (req,res, next)  {
            let token = req.cookies 
            userModel.getUserIdByExtensionToken(token)
            .then(userId=>{
                if (userId) {
                    res.locals.user = {id: data.rows[0].id}
                    next()
                } else {
                    res.json({error:true,msg:'not connected'})
                }
            })

    }
}