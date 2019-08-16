module.exports = function (db) {
    return {
        getLinkId : function (url) {
            return db.query('SELECT id FROM links WHERE url = $1',[url]).then(data=>data.rows.length?data.rows[0]:{id:0})
        },
        getVotes : function (url, userId) {
            return db.query(`SELECT vt.text,color,SUM(CASE WHEN user_id = $1 THEN 1 ELSE 0 END) as is_upvoted_by_current_user ,count(*)as nbr
            FROM votes
            RIGHT JOIN links ON links.id = votes.link_id
            LEFT JOIN votetexts vt ON vt.id = text_id
            WHERE links.url = $2
            GROUP BY text_id,color      
            `,[url,userId] ).then(data =>{
                return data.rows;
            })
        },
        getColorTotalUrl : function (link) {
            let res = db.query('SELECT * FROM links WHERE url = $1', [link])
            return res.then(data =>{
                console.log('link from db :',data.rows.length?data.rows[0]:'');
                return data.rows.length?data.rows[0]:{}
            }).catch(console.error);
        },
        upVote : function (userId,linkId,voteTextId) {
            
        },
        CreateOrUpVoteLinkId : function (linkId,userId,VoteText,VoteColor) {
            //"SELECT CreateOrUpVoteLinkId(1,1,'other new comment','')"
            return  db.query('SELECT  CreateOrUpVoteLinkId($1,$2,$3,$4)', 
                [linkId,userId,VoteText,VoteColor]).then(data=>{
                    return data.rows.length?data.rows:[]
                }).catch(console.error)
        },
        CreateOrUpVoteLinkUrl : function (linkUrl,userId,VoteText,VoteColor) {
            //"SELECT CreateOrUpVoteLinkUrl(1,'http://','other new comment','')"
            return db.query('SELECT CreateOrUpVoteLinkUrl($1,$2,$3,$4)').then(data=>{
                return data.rows.length?data.rows:[]
            }).catch(console.error)
        }

    }
}