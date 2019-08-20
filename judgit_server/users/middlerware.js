module.exports = function (db)  {
    return {
        connected : function (req,res, next)  {
            let token = ''
            db.query('SELECT id FROM user WHERE extension_token = $1',[token])
            .then(data =>{
                if (data.rows.length) {
                    res.locals.user = {id: data.rows[0].id}
                    next()
                } else {
                    res.json({error:true,msg:'not connected'})
                }
            })
        }
    }
}