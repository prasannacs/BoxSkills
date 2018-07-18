// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const BoxSDK = require('box-node-sdk');

var sdk = new BoxSDK({
  clientID: 'quctsqlnvjtanl507z6axh22jyd9jzg1',
  clientSecret: '37isljVOklKg3CY91Z737sEU1ORisS84'
});


// Creates a client
const client = new vision.ImageAnnotatorClient();

// Performs label detection on the image file
client
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
