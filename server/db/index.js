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
let user = {}
let signUp = {}

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

customer.create = (customer_name, customer_address, customer_phone, customer_email, timestamp, video_repository) => {
        return new Promise((resolve, reject) => {
    
            pool.query('INSERT INTO customer SET customer_name = ?, customer_address = ?, customer_phone = ?, customer_email = ?, timestamp = ?, video_repository= ?', [customer_name, customer_address, customer_phone, customer_email, timestamp, video_repository], (err, results) => {
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

    user.create = (email, password, timestamp) => {
        return new Promise((resolve, reject) => {

            pool.query('SELECT * FROM user WHERE user_email = ?', [email], (err, results) => {
                if(err){
                    return reject(err)
                }

                if(results[0] !== undefined){
                return resolve({emailExist: true, message: "The email is already in use"})
                }else{
                
                    pool.query('INSERT INTO user SET user_email = ?, user_password = ?, timestamp = ?', [email, password, timestamp], (err, results) => {
                        if(err){
                            return reject(err)
                        }
                        return resolve("everything is fine")
                
                    })

                    return resolve({emailExist: false, message: "User"})  
                }
        
            })
    
            
        
        })
    }

    user.login = (email, password) => {
        return new Promise((resolve, reject) => {
    
            pool.query('SELECT * FROM user WHERE user_email = ? AND user_password = ?', ["hgfj", password], (err, results) => {
                if(err){
                    return reject(err)
                }

                if(results[0] !== undefined){
                return resolve({loggedIn: true, message: "logged in"})
                }else{
                return resolve({loggedIn: false, message: "Couldn't login, email or password is wrong"})  
                }
        
            })
        
        })
    }

signUp.create = (timestamp) => {
        return new Promise((resolve, reject) => {

            let user_id = null; 
            let customer_id = null;

          pool.query('SELECT * FROM user WHERE timestamp= ?', [timestamp],  (err, results) => {
                if(err){
                    return reject(err)
                }
               
                 user_id = results[0].user_id
                 console.log("user", user_id)
            })

            pool.query('SELECT * FROM customer WHERE timestamp = ?',[timestamp], (err, results) => {
                if(err){
                    return reject(err)
                }
                 customer_id = results[0].customer_id
                 console.log("customer",  customer_id)

           

            if(customer_id !== null){
            pool.query('INSERT INTO customer_user SET user_id = ?, customer_id = ?', [user_id , customer_id], (err, results) => {
                if(err){
                    return reject(err)
                }
                return resolve("everything is fine")
        
            })
             }
         })
           


            //Creates the table that links user and customer

           
        
        })
    }

module.exports = {video, customer, user, signUp}
