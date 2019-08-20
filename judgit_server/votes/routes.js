let router = require('express').Router();
const voteModelUnInit = require('./model')

module.exports = function (db, usersMiddelware) {
    const voteModel = voteModelUnInit(db)
    router.post('/linkId',(req,res)=>{
        voteModel.getLinkId(req.body.url).then(data=>{
            console.warn(data);
            
            res.json(data)
        }).catch(console.warn)
    })

    router.post('/votes',(req,res)=>{
        let {linkId} = req.body
        voteModel.getVotes(linkId,1)
        .then(res.json.bind(res))
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

    router.post('/colorTotalBulk',(req,res)=>{
        let {urls} = req.body
        let urlsAndColorsProms = urls.map(url=>{
            return voteModel.getColorTotalUrl(url).then(colors=>{
                colors.url = url // add colors to the totals so we can associate
                return colors
            })
        })
        Promise.all(urlsAndColorsProms)
        .then(urlsAndColors=>res.json(urlsAndColors))
    })

    router.post('/upVote',usersMiddelware.connected,(req,res)=>{
        let {linkId,textId,color} = req.body
        voteModel.upVote(2,linkId,textId,color).then(o=>res.json(o))
    })

    router.post('/CreateOrUpVoteLinkId',(req,res)=>{
        let {linkId,text,color} = req.body
        let userId = 1
        voteModel.CreateOrUpVoteLinkId(linkId,userId,text,color).then(res.json.bind(res))
    })
    router.post('/CreateOrUpVoteLinkUrl',(req,res)=>{
        let {url,text,color} = req.body
        let userId = 1
        voteModel.CreateOrUpVoteLinkUrl(url,userId,text,color).then(res.json.bind(res))
    })

    return router
}