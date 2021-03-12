const mysql = require('mysql'); 

const pool = mysql.createPool({
    connectionLimit:10, 
    host     : 'db-mysql-ams3-47998-do-user-4805626-0.b.db.ondigitalocean.com',
    port     :  25060,
    user     : 'Christian',
    password : 'og72s02q07ubv5a0',
    database : 'support-video'

})

let users = {}

users.readAll = () => {
return new Promise((resolve, reject) => {

    pool.query('SELECT * FROM users', (err, results) => {
        if(err){
            return reject(err)
        }

        return resolve(results)

    })

})
}; 

users.readOne = (id) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM users WHERE id = ?',[id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve(results[0])
    
        })
    
    })
}

users.delete = (id) => {
    return new Promise((resolve, reject) => {

        pool.query('DELETE FROM users WHERE id = ?',[id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve("everything is fine")
    
        })
    
    })
}

users.update = (id, userid, text) => {
    return new Promise((resolve, reject) => {

        console.log(id, userid, text);

        pool.query('UPDATE users SET text = ?, userid = ? WHERE id = ?',[text, userid, id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve("everything is fine")
    
        })
    
    })
}

users.create = (fk_customer_id, video_path, video_url, browser_type, issue_description) => {
    return new Promise((resolve, reject) => {

        pool.query('INSERT INTO video SET fk_customer_id = ?, video_path = ?, video_url = ?, browser_type = ?, issue_description = ?',[fk_customer_id, video_path, video_url, browser_type, issue_description], (err, results) => {
            if(err){
                return reject(err)
            }
            return resolve("everything is fine")
    
        })
    
    })
}

module.exports = users; 
