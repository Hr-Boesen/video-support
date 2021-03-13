const express = require('express'); 
const db = require('../db'); 
const server = require('../server')

const router = express.Router();

// This is the video section of the API

router.get('/', async (req, res, next) => {
    try{
        let results = await db.readAll(); 
        res.json(results);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        let results = await db.readOne(req.params.id); 
        res.json(results);
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/delete/:id', async (req, res, next) => {
    try{
         await db.delete(req.params.id); 
        res.status(200).json({
            msg: "Deleted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.patch('/update/:id', async (req, res, next) => {
    try{
        await db.update(req.params.id, req.body.fk_customer_id, req.body.video_path, req.body.video_url, req.body.browser_type, req.body.issue_description); 
        res.status(200).json({
            msg: "Updated"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

router.post('/post', async (req, res, next) => {
    try{

         const {videoFileName, timeStamp} = server.createFileNameAndTimeStamp(req.body.fk_customer_id);
         server.createImageFolderAndImages(req.body.dataUrlArray, req.body.fk_customer_id, videoFileName)
         const videoUrl = "video_url test"
         
            
         await db.create(req.body.fk_customer_id, videoFileName, videoUrl, req.body.browser_type, req.body.issue_description, timeStamp); 
        res.status(200).json({
            msg: "Posted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router; 