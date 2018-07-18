// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const BoxSDK = require('box-node-sdk');

// Create a static keyword metadata card
const keywordCard = {
  type: 'skill_card',
  skill_card_type: 'keyword',
  skill: { type: 'service', id: 'my-box-skill' },
  invocation: { type: 'skill_invocation',  id: 'some_id' },
  title: 'Topics',
  duration: 30,
  entries: [{
    type: 'text',
    text: 'hello_world',
    appears: [{ start: 0, end: 1 }]
  }]
};

exports.imageSubscriber = (event, callback) => {
  const pubsubMessage = event.data;
  console.log('Google Vision - Image subscriber');
  var str = Buffer.from(pubsubMessage.data, 'base64').toString();
  console.log(str);
  
  var fileName = str.slice(0,str.indexOf('-Skills-'));
  str = str.slice(fileName.length+8, str.length);
  var fileId = str.slice(0,str.indexOf('-Skills-'));
  str = str.slice(fileId.length+8, str.length);
  var readToken = str.slice(0,str.indexOf('-Skills-'));
  str = str.slice(fileId.length+8, str.length);
  var writeToken = str.slice(0,str.indexOf('-Skills-'));
  
  console.log('fileName -- ',fileName);
  console.log('fileId -- ',fileId);
  console.log('readToken -- ',readToken);
  console.log('writeToken -- ',writeToken);

var sdk = new BoxSDK({
  clientID: 'quctsqlnvjtanl507z6axh22jyd9jzg1',
  clientSecret: '37isljVOklKg3CY91Z737sEU1ORisS84'
});


// Creates a client
const visionClient = new vision.ImageAnnotatorClient();

// Performs label detection on the image file
visionClient
  //.labelDetection('./resources/invest-graph.jpg')
  .labelDetection('https://picsum.photos/458/354/?image=279')
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
  
  // Initialize a basic Box client with the access token
  let client = sdk.getBasicClient(writeToken);

  // First try and delete any boxSkillsCards
  // metadata that has been written previously
  client.files.deleteMetadata(fileId, 'global', 'boxSkillsCards')
    .finally(() => {
      // Only add one card for this example.
      let metadata = cards: [keywordCard];
      // Write the metadata to the file
      client.files.addMetadata(fileId, 'global', 'boxSkillsCards', metadata);
      // Render a HTTP 200 status code and a body 
      // for the Lambda function
      callback(null, { statusCode: 200, body: 'Data saved' });
    }).catch((error) => {
      callback('Data could not be saved');
    });
  
      callback();

};
