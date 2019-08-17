let router = require('express').Router();
const voteModelUnInit = require('./model')

module.exports = function (db) {
    const voteModel = voteModelUnInit(db)
    router.post('/linkId',(req,res)=>{
        voteModel.getLinkId(req.body.url).then(data=>{
            console.warn(data);
            
            res.json(data)
        }).catch(console.warn)
    })

    router.get('/votes',(req,res)=>{
        let {url} = req.body
        voteModel.getVotes(url)
        .then(res.json)
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
        let {linkId} = req.body

    })

    router.post('/CreateOrUpVoteLinkId',(req,res)=>{
        let {linkId,text,color} = req.body
        let userId = 1
        voteModel.CreateOrUpVoteLinkId(linkId,userId,text,color)
    })
    router.post('/CreateOrUpVoteLinkUrl',(req,res)=>{
        let {url,text,color} = req.body
        let userId = 1
        voteModel.CreateOrUpVoteLinkUrl(url,userId,text,color)
    })

    return router
}