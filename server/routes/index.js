const express = require('express'); 
const db = require('../db'); 
const server = require('../server')

const router = express.Router();

// VIDEO API

router.get('/video', async (req, res, next) => {
    try{
        let results = await db.video.readAll(); 
        res.json(results);
    }catch(e){
        console.log(e)
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

router.post('/video/post', async (req, res, next) => {
    try{

        console.log("test post")

         const {videoFileName, timeStamp, videoUrl, videoUrlServerPath} = server.createFileNameAndTimeStamp(req.body.video_repository, req.body.fk_customer_id);

         console.log("videoFileName", videoFileName);
         
         server.createImageFolderAndImages(req.body.dataUrlArray, videoFileName, videoUrlServerPath)
         
            
         await db.video.create(req.body.fk_customer_id, videoFileName, videoUrl, req.body.browser_type, req.body.issue_description, timeStamp); 
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

//Add a user 

router.post('/user/login', async (req, res, next) => {
    try{ 
        const response = await db.user.login(req.body.user_email, req.body.user_password); 

        res.status(200).json(response)

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

         await db.customer.create(req.body.customer_name, req.body.customer_address, req.body.customer_phone, req.body.customer_email, timestamp, videoRepository); 
         await db.user.create(req.body.user_email, req.body.user_password, timestamp); 
         await db.signUp.create(timestamp); 

        res.status(200).json({
            msg: "User and Customer created"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})




module.exports = router; 