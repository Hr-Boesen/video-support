import firebase from "./firebase.js";

class videoSupport {
  constructor() {

    this.start = document.querySelector("#start");
    this.stop = document.querySelector("#stop");
    this.video = document.querySelector("video");
    this.myProgress = document.querySelector(".myProgress");
    this.card = document.querySelector(".card");
    this.sendSupportVideo = document.querySelector("#sendSupportVideo");
    this.finishSupport = document.querySelector("#finish-support");
    this.newSupport = document.querySelector("#new-support");
    this.myBar = document.querySelector(".myBar");
    this.recorder,
    this.stream,
    this.audioStream,
    this.uiDisplay("showStartBtn"),
    this.browserType = this.navigator(),
    this.firebase = firebase,
    this.startFx(),
    this.stopFx(),
    this.newSupportFx(),
    this.finishSupportFx(),
   // this.sendSupportVideoFx(),
    this.completeBlob,
    this.imgURL = null
    this.windowLocation = window.location.hostname;

  }

  uiDisplay(key) {
    this.sendSupportVideo.style.display = "none";
    this.stop.style.display = "none";
    this.video.style.display = "none";
    this.myProgress.style.display = "none";
    this.card.style.display = "none";
    this.start.style.display = "none";

    switch (key) {
      case "showStartBtn":
        this.start.style.display = "block";
        break;
      case "showStopBtn":
        this.stop.style.display = "block";
        break;
      case "finishSupport":
        break;
      case "afterStopButtonPressed":
        this.sendSupportVideo.style.display = "block";
        this.start.style.display = "block";
        this.video.style.display = "block";
        break;
      case "showMyProgressBar":
        this.myProgress.style.display = "block";
        break;
      case "showSupportCard":
        this.card.style.display = "block";
        break;
      default:
        break;
    }

  }


  stopFx() {
    this.stop.addEventListener("click", () => {
      this.uiDisplay("afterStopButtonPressed");
      this.recorder.stop();
      // stream.getVideoTracks()[0].stop();
    });
  }

  newSupportFx() {
    this.newSupport.addEventListener("click", () => {
      this.uiDisplay("showStartBtn");
    })
  }

  finishSupportFx() {
    this.finishSupport.addEventListener("click",  () => {
      this.uiDisplay("finishSupport");
    })
  }

  startFx() {
    this.start.addEventListener("click", () => {
      this.uiDisplay("showStopBtn");

      this.startRecording();
    });


  }


  async startRecording() {

    this.stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: "screen"
      }
    });

    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const audioTrack = this.audioStream.getAudioTracks()[0];
    this.stream.addTrack(audioTrack);

    //OBS
    //var options = {mimeType: "video/webm;codecs=h264"};
    var options = {
      mimeType: "video/x-matroska;codecs=avc1"
    };
    this.recorder = new MediaRecorder(this.stream, options);

    //mediaRecorder = new MediaRecorder(stream, options);

    const chunks = [];
    this.recorder.ondataavailable = e => chunks.push(e.data);
    this.recorder.onstop = e => {
      // const completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.completeBlob = new Blob(chunks, {
        type: "video/mp4"
      });
      this.sendSupportVideoFx(this.completeBlob )
      this.video.src = URL.createObjectURL(this.completeBlob);

    };

    this.recorder.start();
  }

  sendSupportVideoFx() {

    console.log("upload come on...")
    let form = new FormData()
    form.append("fk_customer_id", 1)
    form.append("video_repository", "1test_name__1615793170739")
    form.append("issue_description", "Issue description test")
    form.append("ost.mp4", this.completeBlob)
      fetch('http://localhost:3001/upload', {
        withCredentials:true, 
        method: 'POST',
        body: form,
      
      }).then(
        response => response.json() // if the response is a JSON object
      ).then(
        success => console.log(success) // Handle the success response object
      ).catch(
        error => console.log(error) // Handle the error response object
      );

    }
  



  async uploadVideo(videoFile) {

    let storageRef = await this.firebase.storage().ref('video/' + Date.now() + "videotest");

    let imgRef = storageRef.fullPath;

    let task = storageRef.put(videoFile);

    task.on('state_changed', (snapshot) => {

      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            //show progress
            this.myBar.style.width = percentage + "%";

            if (percentage == 100) {

              this.uiDisplay("showSupportCard");

              let getDownloadURL = setInterval(()=>{ 
              snapshot.ref.getDownloadURL().then((downloadURL) => {
    
                console.log(downloadURL);
                this.imgURL = downloadURL;

                if(this.imgURL !== null){
                  clearInterval(getDownloadURL)
                  this.upLoadMetaDataToFirebase();
                }

                })
              },200);

              

            }
            
          })
   }

  navigator() {
    var ua = navigator.userAgent,
      tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  
  }



upLoadMetaDataToFirebase(){

    firebase.firestore().collection("video").add({
        imgURL: this.imgURL,
        browserType: this.browserType,
        windowLocation: this.windowLocation        

    }).catch(err => {
            console.log(err)
        })
}

}

new videoSupport();





/*

open -a Google\ Chrome --args --disable-web-security --user-data-dir






db.firestore().collection("products").add({
  available: this.available,
  imgURL: this.imgURL,
  imgURLResized500: this.imgURLrezized500,
  imgURLResized200: this.imgURLrezized200,
  name: this.name,
  price: this.price,
  imgRef: this.imgRef,
  description: this.description,
  tags: ["a", "a"]

}).then(() => {

  this.$router.push({
      name: 'Products'


  }).catch(err => {
      console.log(err)
  })
}


*/

/*


// we ask for permission to record the window
// mediaSource could also be 'screen' if we wanted
// to record the entire screen
const getStreamForWindow = () => navigator.mediaDevices.getUserMedia({
    video: {
      mediaSource: 'window'
    }
  });
  
  // we ask for permission to record the audio and video from the camera
  const getStreamForCamera = () => navigator.mediaDevices.getUserMedia({
     audio: true
  });


getStreamForCamera().then(streamCamera => {
    // we know have access to the camera, let's append it to the DOM
    appendCamera(streamCamera);
    getStreamForWindow().then(streamWindow => {

      // we now have access to the screen too
      // we generate a combined stream with the video from the
      // screen and the audio from the camera
      var finalStream = new MediaStream();
      const videoTrack = streamWindow.getVideoTracks()[0];
      finalStream.addTrack(videoTrack);


      const audioTrack = streamCamera.getAudioTracks()[0];
      finalStream.addTrack(audioTrack);




      this.recorder = new MediaRecorder(finalStream);

      // we subscribe to 'ondataavailable'.
      // this gets called when the recording is stopped.
      this.recorder.ondataavailable = function(e) {
        // let's create a blob with e.data which has the
        // contents of the video in webm
        var link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(e.data));
        link.setAttribute('download', 'video_' + Math.floor((Math.random() * 999999)) + '.webm');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // start recording
      this.recorder.start();
    });
  });
  */