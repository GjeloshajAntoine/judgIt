module.exports = function (db) {
    return {
        getLinkId : function (url) {
            return db.query('SELECT id FROM links WHERE url = $1',[url]).then(data=>data.rows.length?data.rows[0]:{id:0}).catch(console.error)
        },
        getVotes : function (linkId, userId) {
            return db.query(`SELECT text_id,vt.text,color,SUM(CASE WHEN user_id = $1 THEN 1 ELSE 0 END) as is_upvoted_by_current_user ,count(*)as nbr,((COUNT(*) / SUM(COUNT(*)) OVER ())*100) AS percentage
            FROM votes
            RIGHT JOIN links ON links.id = votes.link_id
            LEFT JOIN votetexts vt ON vt.id = text_id
            WHERE links.id = $2
            GROUP BY text_id,color,vt.text      
            ORDER BY nbr DESC
            `,[userId,linkId] ).then(data =>{
                let parsedRows = data.rows.map(row=>{
                    row.is_upvoted_by_current_user = parseInt(row.is_upvoted_by_current_user)
                    row.percentage = parseFloat(row.percentage).toFixed(2)
                    return row
                })
                return parsedRows;
            })
        },
        getColorTotalUrl : function (link) {
            let res = db.query('SELECT * FROM links WHERE url = $1', [link])
            return res.then(data =>{
                console.log('link from db :',data.rows.length?data.rows[0]:'');
                return data.rows.length?data.rows[0]:{}
            }).catch(console.error);
        },
        upVote : function (userId,linkId,text_id,color) {
            return db.query('INSERT INTO votes(user_id,link_id,text_id,color) VALUES($1,$2,$3,$4)',
            [userId,linkId,text_id,color]).then(data=>{
                return data.rows
            })
        },
        unVote : function (userId,linkId,textId,color) {
            return db.query('DELETE FROM votes WHERE user_id = $1 AND link_id = $2 AND text_id = $3 AND color = $4',
            [userId,linkId,textId,color]).then(data=>{
                return data.rows
            })
        },
        CreateOrUpVoteLinkId : function (linkId,userId,VoteText,VoteColor) {
            //"SELECT CreateOrUpVoteLinkId(1,1,'other new comment','')"
            return  db.query('SELECT  CreateOrUpVoteLinkId($1,$2,$3,$4::colors)', 
                [userId,linkId,VoteText,VoteColor]).then(data=>{
                    return data.rows.length?data.rows:[]
                }).catch(console.warn)
        },
        CreateOrUpVoteLinkUrl : function (linkUrl,userId,VoteText,VoteColor) {
            //"SELECT CreateOrUpVoteLinkUrl(1,'http://','other new comment','')"
            return db.query('SELECT createorupvotelinkurl($1,$2,$3,$4::colors)',
            [userId,linkUrl,VoteText,VoteColor]
            ).then(data=>{
                return data.rows.length?data.rows:[]
            }).catch(console.error)
        }

    }
}