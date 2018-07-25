// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const BoxSDK = require('box-node-sdk');
const Request = require("request");

exports.imageSubscriber = (event, callback) => {
    const pubsubMessage = event.data;
    console.log('Google Vision - Image subscriber');
    var str = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(str);

    var fileName = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(fileName.length + 8, str.length);
    var fileId = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(fileId.length + 8, str.length);
    var readToken = str.slice(0, str.indexOf('-Skills-'));
    str = str.slice(readToken.length + 8, str.length);
    var writeToken = str;

    console.log('fileName -- ', fileName);
    console.log('fileId -- ', fileId);
    console.log('readToken -- ', readToken);
    console.log('writeToken -- ', writeToken);

    var sdk = new BoxSDK({
        clientID: 'foo',
        clientSecret: 'bar'
    });
    
    var entriesTags = [];

    var boxFileURL = 'https://api.box.com/2.0/files/' + fileId + '/content?access_token=' + readToken;
    var visionBody = {"requests": [{"image": {"source": {"imageUri": boxFileURL}},"features": [{"type": "LABEL_DETECTION","maxResults": 25},{"type": "LABEL_DETECTION","maxResults": 2}]}]}
    
   var options = {
      method: 'POST',
      json: visionBody,
      url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAuf-Etfi6ImFsdkH8Ws2mTNXFZWkTIeb0',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    function callback(error, response, body) {
      console.log('Body ',body.responses)
      if (!error && response.statusCode == 200) {
        var labels = body.responses[0].labelAnnotations;
        labels.forEach(label => entriesTags.push({'text': label.description}))
        labels.forEach(label => console.log('LD ',label.description));
              // Initialize a basic Box client with the access token
        let client = sdk.getBasicClient(writeToken);
        client.files.addMetadata(fileId, 'global', 'boxSkillsCards', keywordsMetadata, (error, res) => {
            if (error) {
                console.log('Error in adding metadata ', error);
            }
            else {

                res = {
                    statusCode: 200,
                    body: "Vision Skill Done"
                }
                console.log("skill updated");
                return res;
            }
        });

      }
      if (error)  {
        console.log('Error--',error)
      }
    }
 
    Request(options, callback);

    console.log('Vision API processing completed',entriesTags);
    // Create a  keyword metadata card
    let keywordsMetadata = {
        "cards": [{
                "type": "skill_card",
                "skill_card_type": "keyword",
                "skill": {
                    "type": "service",
                    "id": "box-skill-google-vision"
                },
                "invocation": {
                    "type": "skill_invocation",
                    "id": "5555"
                },
                "skill_card_title": {
                    "message": "Google Vision Tags"
                },
                "entries": entriesTags
            }
        ]
    }
}
