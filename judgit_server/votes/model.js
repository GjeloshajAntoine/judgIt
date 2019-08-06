module.exports = function (db) {
    return {
        getNVotes : function (link, n) {
            db.query()
            new Promise()
        },
        getColorTotalUrl : function (link) {
            let res = db.query('SELECT * FROM links WHERE url = $1', [link])
            return res.then(data =>{
                console.log('link from db :',data.rows.length?data.rows[0]:'');
                return data.rows.length?data.rows[0]:{}
            }).catch(console.error);
        },
        upVote : function (userId,voteId) {
            
        },
        CreateOrUpVoteLinkId : function (linkId,userId,VoteText,VoteColor) {
            "SELECT CreateOrUpVoteLinkId(1,1,'other new comment','')"
            return  db.query('SELECT  CreateOrUpVoteLinkId($1,$2,$3,$4)', 
                [linkId,userId,VoteText,VoteColor]).then(data=>{
                    return data.rows.length?data.rows:[]
                }).catch(console.error)
        },
        CreateOrUpVoteLinkUrl : function (linkUrl,userId,VoteText,VoteColor) {
            "SELECT CreateOrUpVoteLinkUrl(1,'http://','other new comment','')"
            return db.query('SELECT CreateOrUpVoteLinkUrl($1,$2,$3,$4)').then(data=>{
                return data.rows.length?data.rows:[]
            }).catch(console.error)
        }

    }
}