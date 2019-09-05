const router = require('express').Router();
const path = require('path');

module.exports = function () {

    router.post('/git/hooks/push',(res,req)=>{

    })
    router.get('/version',(req,res)=>{
        let mainFolder = path.dirname(require.main.filename)
        console.log(mainFolder);
        res.json({test:mainFolder})
    })
    return router
}