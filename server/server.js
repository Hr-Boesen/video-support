const fs = require("fs");
const sharp = require("sharp");
const cmd = require("node-cmd");
const cors = require('cors') 
const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const path = require("path");
var rimraf = require("rimraf");
const apiRouter = require('./routes')
// this is just to move a file
const moveFile = require('move-file');
const session = require('express-session');


app.use(cors())

app.use(bodyParser.json({
    limit: '200mb'
}));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true 
}));



// Setting up API
app.use(express.json()); 


app.use(
    session(
    {
        secret: 'fhdfhswep03y8hpwijegnidhgåuhwGRGAG', 
        resave: true, 
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 10000 * 60 * 60 * 24 * 7,
            secure: false
          }
    }
));



//allows cross site scripting from localhost


//npm run dev -> to run nodemon




app.use('/api', apiRouter);

//npm run dev -> to run nodemon

// How to create a connection pool and a API with mysql node module: https://www.youtube.com/watch?v=LVfH5FDOa3o

app.use(express.static(path.join(__dirname, '../public/dist')));

app.listen(3001, () => {
    console.log("Server runs at port 3001");
});


const createImageFolderAndImages = async (dataUrlArray, videoFileName, videoUrlServerPath) => {

    let durationAndImgURL = "";
    var imageDir = './ImageDir' + Date.now();

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    imageDir = imageDir.substring(2);

    let durationFile = "";

     let minHeight = Infinity;
     let minWidth = Infinity;

    for (let index = 0; index < dataUrlArray.length; index++) {
        minHeight = Math.min(dataUrlArray[index].innerHeight, minHeight);
        minWidth = Math.min(dataUrlArray[index].innerWidth, minWidth);
    }

    if(minHeight % 2 != 0){
        minHeight = minHeight - 1;
    }
    if(minWidth % 2 != 0){
        minWidth = minWidth - 1;
    }




    for (let index = 0; index < dataUrlArray.length; index++) {

        let file = dataUrlArray[index].dataURL.split(';base64,').pop()

        let buffer = Buffer.from(file, "base64")


       let imgWidth = (await sharp(buffer).metadata()).width; 
       let imgHeight = (await sharp(buffer).metadata()).height;
  
       function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
      }

      let width = clamp(minWidth, 0, imgWidth);
      let height= clamp(minHeight, 0, imgHeight);

      let top, left;
      if(dataUrlArray[index].scrollY<=0){
          top = 0
      }else{
          if(dataUrlArray[index].scrollY + height > imgHeight){
              top = imgHeight - height;
          }else{
              top = dataUrlArray[index].scrollY;
          }
      }
      if(dataUrlArray[index].scrollX<=0){
        left = 0
      }else{
          if(dataUrlArray[index].scrollX + width > imgWidth){
            left = imgWidth - width;
          }else{
            left = dataUrlArray[index].scrollX;
          }
      }



      console.log(
        {

            width,
            height,
            left,
            top, 
            innerWidth: dataUrlArray[index].innerWidth,
            innerHeight: dataUrlArray[index].innerHeight,
            scrollX: dataUrlArray[index].scrollX,
            scrollY: dataUrlArray[index].scrollY,
            imgWidth,
            imgHeight,
            minHeight, 
            minWidth
        }

      )

        await sharp(buffer)
            .extract({
                width: minWidth,
                height: minHeight,
                left,
                top
            })
            .toFile(imageDir + "/img" + index + ".png")

        durationFile += `file ${imageDir}/img${index}.png\nduration 0.4\n`

        if (dataUrlArray.length - 1 == index) {
            durationFile += `file ${imageDir}/img${index}.png`
        }
    }

    

    createVideoFile(durationFile, videoFileName, videoUrlServerPath)

    rimraf(imageDir, function () { console.log("imageDir folder deleted"); });
 
}

const createFileNameAndTimeStamp = (videoRepository, customerId)=>{

    const timeStamp = Date.now()
    let videoFileName = customerId + "id" + timeStamp + ".mp4"

    let videoUrlServerPath = 'public/dist/video_repository/' + videoRepository + '/' + videoFileName
    let videoUrl = 'localhost:3000/video_repository/' + videoRepository + '/' + videoFileName

    return {videoFileName, timeStamp, videoUrl, videoUrlServerPath }
}


const createVideoRepositoryForNewCustomers = (customerName, timeStamp) =>{
    let VideoRepository = './public/dist/video_repository/' + timeStamp +'__' + customerName;

    if (!fs.existsSync(VideoRepository)) {
        fs.mkdirSync(VideoRepository);

        return timeStamp +'__' + customerName;
    }
 
}


const  moveFileToCustomerFolder = async(fileName, customerFolder) =>{
    await moveFile(fileName, customerFolder );
    console.log('The file has been moved');
}

const createVideoFile = (durationFile,videoFileName, videoUrlServerPath) => {
    let finalString = "ffmpeg -y -f concat -i imageFile.txt -vsync vfr -pix_fmt yuv420p "  + videoFileName
    let imageFile = fs.writeFile('imageFile.txt', durationFile, () => {
        console.log("The file has been written");
        console.log(finalString);
        cmd.runSync(finalString);

       // move file to the customers folder
       moveFileToCustomerFolder(videoFileName, videoUrlServerPath)
    })
}



exports.createImageFolderAndImages = createImageFolderAndImages;
exports.createFileNameAndTimeStamp = createFileNameAndTimeStamp;
exports.createVideoRepositoryForNewCustomers = createVideoRepositoryForNewCustomers;

