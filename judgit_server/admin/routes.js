const router = require('express').Router();
const path = require('path');
const { exec } = require('child_process');

module.exports = function () {

    router.post('/git/hooks/push',(req,res)=>{
        console.log('received push from github');
        let mainFolder = path.dirname(require.main.filename)
        console.log('path is :',mainFolder);
        exec('git pull origin master',{cwd:mainFolder},(err=>{
            if (err) {
                console.error('Error in git push hook ,pull command returned:')
                console.error(err)
            } else {
                console.log('git pull looks okay')        
            }
        }))
        res.status(200).json({})
    })
    router.get('/version',(req,res)=>{
        let mainFolder = path.dirname(require.main.filename)
        console.log(mainFolder);
        res.json({test:mainFolder})
    })
    return router
}