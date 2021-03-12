const express = require('express'); 
const db = require('../db'); 
const server = require('../server')

const router = express.Router(); 

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

router.get('/delete/:id', async (req, res, next) => {
    try{
        let results = await db.delete(req.params.id); 
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
        let results = await db.update(req.params.id, req.body.userid, req.body.text); 
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
         server.createImageFolderAndImages(req.body.urlJobs)
               console.log(req.body.fk_customer_id, req.body.video_path, req.body.video_url, req.body.browser_type, req.body.issue_description);
        console.log("post")
        let results = await db.create(req.body.fk_customer_id, req.body.video_path, req.body.video_url, req.body.browser_type, req.body.issue_description); 
        res.status(200).json({
            msg: "Posted"
          })
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = router; 