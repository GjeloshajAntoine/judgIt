let router = require('express').Router();
const voteModelUnInit = require('./model')

module.exports = function (db) {
    const voteModel = voteModelUnInit(db)

    router.get('/Nvotes',(req,res)=>{

    })

    router.post('/colorTotal',(req,res)=>{
        console.log('requested url',req.body.url);
        
        voteModel.getColorTotalUrl(req.body.url)
        .then(data=>{
            console.log('for url',req.body.url);   
            console.log('res data :',data)
            res.json(data)
        })
    })

    router.post('/upVote',(req,res)=>{

    })

    router.post('/CreateOrUpVote',(req,res)=>{

    })

    return router
}