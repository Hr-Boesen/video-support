const mysql = require('mysql'); 

const pool = mysql.createPool({
    connectionLimit:10, 
    host     : 'db-mysql-ams3-47998-do-user-4805626-0.b.db.ondigitalocean.com',
    port     :  25060,
    user     : 'Christian',
    password : 'og72s02q07ubv5a0',
    database : 'support-video'

})

let video = {}
let customer = {}

// VIDEO API

video.readAll = () => {
return new Promise((resolve, reject) => {

    pool.query('SELECT * FROM video', (err, results) => {
        if(err){
            return reject(err)
        }

        return resolve(results)

    })

})
}; 

video.readOne = (video_id) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM video WHERE video_id = ?',[video_id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve(results[0])
    
        })
    
    })
}

video.delete = (video_id) => {
    return new Promise((resolve, reject) => {

        pool.query('DELETE FROM video WHERE video_id = ?',[video_id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve("everything is fine")
    
        })
    
    })
}

video.update = (video_id, issue_description) => {
    return new Promise((resolve, reject) => {

        pool.query('UPDATE video SET issue_description = ? WHERE video_id = ?',[issue_description, video_id], (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve("everything is fine")
    
        })
    
    })
}

video.create = (fk_customer_id, video_path, video_url, browser_type, issue_description, timestamp) => {
    return new Promise((resolve, reject) => {

        pool.query('INSERT INTO video SET fk_customer_id = ?, video_path = ?, video_url = ?, browser_type = ?, issue_description = ?, timestamp = ?',[fk_customer_id, video_path, video_url, browser_type, issue_description, timestamp], (err, results) => {
            if(err){
                return reject(err)
            }
            return resolve("everything is fine")
    
        })
    
    })
}

//CUSTOMER API 

customer.readAll = () => {
    return new Promise((resolve, reject) => {
    
        pool.query('SELECT * FROM customer', (err, results) => {
            if(err){
                return reject(err)
            }
    
            return resolve(results)
    
        })
    
    })
    }; 

customer.readOne = (customer_id) => {
    return new Promise((resolve, reject) => {
    
            pool.query('SELECT * FROM customer WHERE customer_id = ?',[customer_id], (err, results) => {
                if(err){
                    return reject(err)
                }
        
                return resolve(results[0])
        
            })
        
        })
    }

customer.delete = (customer_id) => {
        return new Promise((resolve, reject) => {
    
            pool.query('DELETE FROM customer WHERE customer_id = ?',[customer_id], (err, results) => {
                if(err){
                    return reject(err)
                }
        
                return resolve("everything is fine")
        
            })
        
        })
    }

customer.create = (customer_name, customer_address, customer_phone, customer_email, timestamp) => {
        return new Promise((resolve, reject) => {
    
            pool.query('INSERT INTO customer SET customer_name = ?, customer_address = ?, customer_phone = ?, customer_email = ?, timestamp = ?', [customer_name, customer_address, customer_phone, customer_email, timestamp], (err, results) => {
                if(err){
                    return reject(err)
                }
                return resolve("everything is fine")
        
            })
        
        })
    }


customer.update = (customer_name, customer_address, customer_phone, customer_email, customer_id) => {
        return new Promise((resolve, reject) => {
    
            pool.query('UPDATE customer SET customer_name = ?, customer_address = ?, customer_phone = ?, customer_email = ? WHERE customer_id = ?',[customer_name, customer_address, customer_phone, customer_email, customer_id], (err, results) => {
                if(err){
                    return reject(err)
                }
        
                return resolve("everything is fine")
        
            })
        
        })
    }

module.exports = {video, customer}
