const express = require('express'); 
const db = require('../db'); 
const server = require('../server')


const router = express.Router();



// VIDEO API

router.get('/video', async (req, res, next) => {
    try{

        let userId = req.session.userId

        console.log("2 userId", userId)

        let results = await db.video.readAll(userId); 
        res.json(results);
    
    }catch(e){
        
        res.sendStatus(500)
    }
})

router.get('/video/links', async (req, res, next) => {
    try{

        let userId = req.session.userId

        console.log(userId)

        let results = await db.video.readAllVideoLinks(userId); 
        res.json(results);
    
    }catch(e){
        
        res.sendStatus(500)
    }
})




router.get('/video/:id', async (req, res, next) => {
    try{
        let results = await db.video.readOne(req.params.id); 

        res.json(results);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/video/delete/:id', async (req, res, next) => {
    try{
         await db.video.delete(req.params.id); 

         
        res.status(200).json({
            msg: "Deleted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.patch('/video/update/:id', async (req, res, next) => {
    try{
        await db.video.update(req.params.id, req.body.issue_description); 
        res.status(200).json({
            msg: "Updated"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})


//Video and sound upload

router.post('/videoandsound/post', async (req, res, next) => {
  
        // const {videoFileName, timeStamp, videoUrl, videoUrlServerPath} = server.createFileNameAndTimeStamp(req.body.video_repository, req.body.fk_customer_id);

        console.log(req.files);
        let sampleFile;
        let uploadPath;
      
        
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({status: 'No files were uploaded.'});
        }

    
      
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

        sampleFile = req.files["ost.mp4"];
        uploadPath = __dirname + "/test.mp4"
      
        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
          if (err)
            return res.status(500).json({err: "json"});
      
          res.json({succces: 'File uploaded!'});
        });
   
})


router.post('/video/post', async (req, res, next) => {
    try{

        console.log("ost ost ost", req.body.webSiteUrlsArray); 

        console.log("ost")

         const {videoFileName, timeStamp, videoUrl, videoUrlServerPath} = server.createFileNameAndTimeStamp(req.body.video_repository, req.body.fk_customer_id);

         console.log("videoFileName", videoFileName);
         
         server.createImageFolderAndImages(req.body.dataUrlArray, videoFileName, videoUrlServerPath)
            
         const videoId = await db.video.create(req.body.fk_customer_id, videoFileName, videoUrl, req.body.browser_type, req.body.issue_description, timeStamp); 

         await db.video.websiteUrls(videoId, req.body.webSiteUrlsArray); 

        res.status(200).json({
            msg: "Posted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})



// CUSTOMER API

//Get all customers
router.get('/customer', async (req, res, next) => {
    try{
        let results = await db.customer.readAll(); 
        res.json(results);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

// Get one customer  
router.get('/customer/:id', async (req, res, next) => {
    try{
        let results = await db.customer.readOne(req.params.id); 
        res.json(results);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

//Delete a customer
router.delete('/customer/delete/:id', async (req, res, next) => {
    try{
         await db.customer.delete(req.params.id); 
        res.status(200).json({
            msg: "Deleted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

//Add a customer
router.post('/customer/post', async (req, res, next) => {
    try{ 
        
        //Timestamp to be saved in the database and used as a part of the name of the customer video repository 
        let timestamp = Date.now();
        //Customer name used as a part of the customers video repository
        let customerName = req.body.customer_name; 

        let videoRepository = server.createVideoRepositoryForNewCustomers(timestamp, customerName);

         await db.customer.create(req.body.customer_name, req.body.customer_address, req.body.customer_phone, req.body.customer_email, timestamp, videoRepository); 
        res.status(200).json({
            msg: "Posted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

// Update customer 
router.patch('/customer/update/:id', async (req, res, next) => {
    try{
        await db.customer.update(req.body.customer_name, req.body.customer_address, req.body.customer_phone, req.body.customer_email, req.params.id); 
        res.status(200).json({
            msg: "Updated"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

//USER 

//Add a user 

router.post('/user/post', async (req, res, next) => {
    try{ 

        let timestamp = Date.now();
        
        const response =  await db.user.create(req.body.user_email, req.body.user_password, timestamp); 
        res.status(200).json(response)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

//User Login

router.post('/user/login', async (req, res, next) => {
    try{ 

        console.log(req.body.user_email);
 
        const response = await db.user.login(req.body.user_email, req.body.user_password); 

        if(response[0].loggedIn){
            req.session.userId = response[1].userId; 

            console.log(req.session)
                
            console.log("1 userId", req.session.userId);
        }

        res.status(200).json(response[0])

    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

// User Logout 

router.post('/user/logout', async (req, res, next) => {
    try{ 

        console.log("1 req.session.userId", req.session.userId)
        delete req.session.userId 
        console.log("2 req.session.userId", req.session.userId)

        if(req.session.userId === undefined){
          res.status(200).json("user logged out")  
        }else{
            res.status(200).json("Couldn't log user out")   
        }

        

    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

//Add a customer and a user SignUp 

router.post('/signUp/post', async (req, res, next) => {
    
    try{ 
        
        //Timestamp to be saved in the database and used as a part of the name of the customer video repository 
        let timestamp = Date.now();
        //Customer name used as a part of the customers video repository
        let customerName = req.body.customer_name; 

        let videoRepository = server.createVideoRepositoryForNewCustomers(timestamp, customerName);
       console.log(1)
      
       const checkUserEmail = await db.signUp.checkUserEmail(req.body.user_email); 
       const customerNameCheck = await db.signUp.customerNameCheck(req.body.customer_name)

       // User email or customer name is taken inform the user
      if(checkUserEmail.continueSignUpUser === false || customerNameCheck.continueSignUpCustomer === false)
      {
        return res.status(200).json({...customerNameCheck, ...checkUserEmail})
      }else {

        //Create the user and get the user_id
       const userId = await db.user.create(req.body.user_email, req.body.user_password, timestamp)
        //Create the customer and get the customer_id
       const customerId =  await db.customer.create(req.body.customer_name, req.body.customer_address, req.body.customer_phone, req.body.customer_email, timestamp, videoRepository)
        //Create the user/customer relation and get the customerUserId
       const customerUserId = await db.signUp.create(userId, customerId)  
         
    
       //Check if user, customer and relation between the two all have an id
       if(userId && customerId && customerUserId){

        req.session.userId = userId;

        //User and customer are created and the user can enter the site
            return res.status(200).json({...customerNameCheck, ...checkUserEmail})
       }else{
            return res.status(200).json({message: "Unknown error"}) 
       }


      }
              
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})






module.exports = router; 