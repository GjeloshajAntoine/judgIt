let router = require('express').Router();
const voteModelUnInit = require('./model')

module.exports = function (db) {
    const voteModel = voteModelUnInit(db)

    router.get('/Nvotes',(req,res)=>{

    })

    router.get('/colorTotal/:url',(req,res)=>{
        voteModel.getColorTotalUrl(req.params.url)
        .then(res.send)
    })

    router.post('/upVote',(req,res)=>{

    })

    router.post('/CreateOrUpVote',(req,res)=>{

    })

    return router
}