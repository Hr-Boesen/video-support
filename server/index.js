const fs = require("fs");
const sharp = require("sharp");
const cmd = require("node-cmd");
const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const path = require("path");
var rimraf = require("rimraf");
const mysql = require('mysql');

// How to create a connection pool and a API with mysql node module: https://www.youtube.com/watch?v=LVfH5FDOa3o


app.use(express.static(path.join(__dirname, '../public/dist')));

app.listen(3000, () => {
    console.log("Server runs at port 3000");
});

app.use(bodyParser.json({
    limit: '200mb'
}));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true 
}));


app.post("/data", (req, res) => {
    var dataUrlArray = req.body.dataUrlArray;
    var browserType = req.body.browserType
    var customerId = req.body.customerId
    var issueDescription = req.body.issueDescription

    createImageFolderAndImages(dataUrlArray)
    res.json({
        response: "dataURL's received"
    })

    var connection = mysql.createConnection({
        host     : 'db-mysql-ams3-47998-do-user-4805626-0.b.db.ondigitalocean.com',
        port     :  25060,
        user     : 'Christian',
        password : 'og72s02q07ubv5a0',
        database : 'support-video'
      });
       
     connection.connect();
  
 
connection.query('INSERT INTO video SET ?', {fk_customer_id: customerId, browser_type: browserType} , function (error, results, fields) {
    if (error) throw error;
    console.log("inserted customer_name");
  });

connection.end();

})

const createImageFolderAndImages = async (dataUrlArray) => {

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
    createVideoFile(durationFile)

    rimraf(imageDir, function () { console.log("imageDir folder deleted"); });

}

const createVideoFile = (durationFile) => {
    let dateString = Date.now()
    let finalString = "ffmpeg -y -f concat -i imageFile.txt -vsync vfr -pix_fmt yuv420p " + dateString + "output.mp4"
    let imageFile = fs.writeFile('imageFile.txt', durationFile, () => {
        console.log("The file has been written");
        cmd.runSync(finalString);
    })
}
