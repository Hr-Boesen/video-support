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

video.readAll = (userId) => {
return new Promise((resolve, reject) => {


    pool.query('SELECT * FROM video INNER JOIN  website_url ON website_url.fk_video_id = video.video_id INNER JOIN customer_user ON customer_user.customer_id = video.fk_customer_id WHERE customer_user.user_id = ?',[userId], (err, results) => {
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
        })
            pool.query('DELETE FROM website_url WHERE fk_video_id = ?',[video_id], (err, results) => {
                if(err){
                    return reject(err)
                }
    })
            return resolve("everything is fine")
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

        pool.query('INSERT INTO video SET fk_customer_id = ?, video_path = ?, video_url = ?, browser_type = ?, issue_description = ?, timestamp = ?',[fk_customer_id, video_path, video_url, browser_type, issue_description, timestamp], (err, result) => {
            if(err){
                return reject(err)
            }
            return resolve(result.insertId)
    
        })
    
    })
}

video.websiteUrls = (videoId, websiteUrls) => {
    return new Promise((resolve, reject) => {

        websiteUrls.forEach(websiteUrl => {

            pool.query('INSERT INTO website_url SET fk_video_id = ?, website_url = ?, timestamp = ?',[videoId, websiteUrl.href, websiteUrl.timestamp], (err, result) => {
                if(err){
                    return reject(err)
                }
                return resolve(result.insertId)
        
            })
            
        });

       
    
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
    
            pool.query('INSERT INTO customer SET customer_name = ?, customer_address = ?, customer_phone = ?, customer_email = ?, timestamp = ?, video_repository= ?', [customer_name, customer_address, customer_phone, customer_email, timestamp, video_repository], (err, result) => {
                if(err){
                    return reject(err)
                }else {
                     return resolve(result.insertId) 
                }
              
        
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

//USER 
    user.create = (email, password, timestamp) => {
        return new Promise((resolve, reject) => {

                    pool.query('INSERT INTO user SET user_email = ?, user_password = ?, timestamp = ?', [email, password, timestamp], (err, result) => {
                        if(err){
                            console.log(err)
                            return reject(err)
                        }else{
                        
                        // i stedet for at lave en ny forespørgsel, så henter man det nyeste id med insertId på result objekted    
                        var userId = result.insertId;  
                        return resolve(userId)     
                        }
                      
                    })
                         
        })
    }

    user.login = (email, password) => {
        return new Promise((resolve, reject) => {
    
            pool.query('SELECT * FROM user WHERE user_email = ? AND user_password = ?', [email, password], (err, results) => {
                if(err){
                    return reject(err)
                }

                if(results[0] !== undefined){
                return resolve([{loggedIn: true, message: "logged in"}, {userId: results[0].user_id}])
                }else{
                return resolve([{loggedIn: false, message: "Couldn't login, email or password is wrong"},{userId: null}])  
                }
        
            })
        
        })
    }

//SIGN UP

signUp.create = (userId, customerId) => {

        return new Promise((resolve, reject) => {

                    pool.query('INSERT INTO customer_user SET user_id = ?, customer_id = ?', [userId , customerId], (err, result) => {
                
                        if(err){
                            return reject(err)
                        }else{
                            return resolve(result.insertId)
                         }
                })   
        })}

signUp.checkUserEmail = (email) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM user WHERE user_email = ?', [email], (err, results) => {
            if(err){
                return reject(err)
            }
        if(results[0] !== undefined){
            return resolve({continueSignUpUser: false, messageUser: "The email is already in use"})
            }else{
            return resolve({continueSignUpUser: true, messageUser: "The email is valied, the Sign Up process can continue"})
            }
        })

         
    })  
}

signUp.customerNameCheck = (name) => {
    return new Promise((resolve, reject) => {

        pool.query('SELECT * FROM customer WHERE customer_name = ?', [name], (err, results) => {
            if(err){
                return reject(err)
            }
        if(results[0] !== undefined){
            return resolve({continueSignUpCustomer: false, messageCustomer: "The customer name is already in use"})
            }else{
            return resolve({continueSignUpCustomer: true, messageCustomer: "The customer name is valid, the Sign Up process can continue"})
            }
        })

         
    })  
}


module.exports = {video, customer, user, signUp}
