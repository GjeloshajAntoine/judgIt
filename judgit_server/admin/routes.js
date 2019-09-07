const router = require('express').Router();
const path = require('path');
const { exec } = require('child_process');

module.exports = function () {

    router.post('/git/hooks/push',(res,req)=>{
        console.log('received push from github');
        let mainFolder = path.dirname(require.main.filename)
        exec('git pull origin master',{pwd:mainFolder},(err=>{
            if (err) {
                console.error('Error in git push hook ,pull command returned:')
                console.error(err)
            } else {
                console.log('git pull looks okay')        
            }
        }))
    })
    router.get('/version',(req,res)=>{
        let mainFolder = path.dirname(require.main.filename)
        console.log(mainFolder);
        res.json({test:mainFolder})
    })
    return router
}