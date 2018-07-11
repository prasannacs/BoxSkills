const PubSub = require(`@google-cloud/pubsub`);

module.exports = function boxSkills(req, res) {
    const fileName = req.body.source.name;
    var fileId = req.body.source.id;
    var readToken = req.body.token.read.access_token;
    var writeToken = req.body.token.write.access_token;
    console.log(fileName);
    
    var filext = fileName.substring(fileName.indexOf("."))
  if( filext == ".jpg" || filext == ".png" || filext == ".bmp" ) {
    console.log('Valid file '+filext);
    var topicName;
	topicName = 'box-skills-image-topic'
    console.log('topciNane ',topicName);
    const pubsub = new PubSub();
    const dataBuffer = Buffer.from(fileName,fileId,readToken,writeToken);
    pubsub
     .topic(topicName)
     .publisher()
     .publish(dataBuffer)
     .then(results => {
    const messageId = results[0];
    console.log(`Message ${messageId} published.`);
  })
  .catch(err => {
    console.error('ERROR in publishing file name:', err);
  });
  }else {
    console.log("Not a valid file extension. File extension must be csv json or xml");
  }
    res.send('Box Skills - Ack');
}
