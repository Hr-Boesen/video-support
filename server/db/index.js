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

// This is the video section of the API

users.readAll = () => {
return new Promise((resolve, reject) => {

    pool.query('SELECT * FROM video', (err, results) => {
        if(err){
            return reject(err)
        }

        return resolve(results)

    })

})
}; 

users.readOne = (video_id) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM video WHERE video_id = ?',[video_id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve(results[0])
    
        })
    
    })
}

users.delete = (video_id) => {
    return new Promise((resolve, reject) => {

        pool.query('DELETE FROM video WHERE video_id = ?',[video_id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve("everything is fine")
    
        })
    
    })
}

users.update = (video_id, fk_customer_id, video_path, video_url, browser_type, issue_description) => {
    return new Promise((resolve, reject) => {

        pool.query('UPDATE video SET fk_customer_id = ?, video_path = ?, video_url = ?, browser_type = ?, issue_description = ? WHERE video_id = ?',[fk_customer_id, video_path, video_url, browser_type, issue_description, video_id], (err, results) => {
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
