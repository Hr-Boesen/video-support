var html2canvas = require('html2canvas');
// Skriv dette i terminal og du få en ip-adresse til at teste på din telefon: 
// ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'
class sendNote {


    constructor() {
        this.screenshotTarget = document.body;
        this.arrURLJobs = [];
        console.log("set up works");
        this.startCamera();
        this.interval = false;
        this.browserType = this.navigator()
        this.webSiteUrlsArray;
        this.urlScriptFlag= false; 


        //this.sendDataUrlArray(); 
    }

     sendDataUrlArray() {

         Promise.all(this.arrURLJobs).then((urlJobs)=>{
            fetch("http://localhost:3001/api/video/post", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                dataUrlArray: urlJobs,
                webSiteUrlsArray: this.webSiteUrlsArray,
                browser_type: this.browserType,
                fk_customer_id: 1, 
                video_repository: "1test_name__1615793170739",
                issue_description: "Issue description test", 
                
                })
            })
            .then((response) => {
                console.log(response)
            });
         })

       
    }

    startCamera() {

        

        document.querySelector("button").addEventListener("click", () => {
             this.sendDataUrlArray();
             clearInterval(window._badJSPractice_supportImageInterval);
             console.log("url-array", this.WebSiteUrlsArray);
             localStorage.removeItem('data');
         })

   
         
        window._badJSPractice_supportImageInterval = setInterval(() => {
            console.log("noget tekst"); 
            let takeImageJob = html2canvas(this.screenshotTarget, {scale: 1}).then((canvas) => {
                canvas.toDataURL("image/png", 0.3);
                 let ImgObject = {
                     scrollX:  window.scrollX,
                     scrollY: window.scrollY,
                     innerHeight:window.innerHeight,
                     innerWidth: window.innerWidth,
                     devicePixelRatio: window.devicePixelRatio,
                     dataURL: canvas.toDataURL("image/png").toString()
                 }
                  
               if(this.urlScriptFlag === false){
                   this.getWebSiteUrls();
                   this.urlScriptFlag = true; 
               }
                 
                
                        
                 return ImgObject;
            
             });

             this.arrURLJobs.push(takeImageJob)
        },400);

        
     
    }


    getWebSiteUrls(){
let href = window.location.href;
let timestamp =  Date.now(); 

this.old_href = href;

new_data = {href, timestamp}

if(localStorage.getItem('data') == null){
    localStorage.setItem('data', '[]');
}

var old_data = JSON.parse(localStorage.getItem('data')); 
    old_data.push(new_data)

    localStorage.setItem('data', JSON.stringify(old_data)); 

   this.webSiteUrlsArray = JSON.parse(localStorage.getItem('data')); 

    //remove item when stop button is pressed. 
    //
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

}

new sendNote();


 

/*
html2canvas(container).then(function(canvas) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = "html_image.png";
    link.href = canvas.toDataURL("image/png");
    link.target = '_blank';
    link.click();
});


html2canvas(document.querySelector("body")).then(canvas => {
    document.body.appendChild(canvas)
});
*/