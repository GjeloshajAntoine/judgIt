module.exports = function (db) {
    return {
        createUserWithExtensionToken : function (token) {
            return db.query('INSERT INTO users(extension_token) VALUES($1) RETURNING id',
            [token]).then(data=>{
                return data.rows[0].id
            })
        },
        getUserIdByExtensionToken : function (token) {
            return db.query('SELECT id FROM users WHERE extension_token = $1',
            [token]).then(data=>{
                return data.rows.length ? data.rows[0].id : 0  
            })
        }
    }
}