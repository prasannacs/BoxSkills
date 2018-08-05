// Imports the Google Cloud client library
const BigQuery = require('@google-cloud/bigquery');

// Your Google Cloud Platform project ID
const projectId = 'sixth-hawk-194719';

// Creates a client
const bigquery = new BigQuery({
  projectId: projectId,
});
exports.logSubscriber = (event, callback) => {
    
    console.log('event -- ',event);
   const pubsubMessage = event.data;
    console.log('Log subscriber');
    var str = Buffer.from(pubsubMessage.data, 'base64').toString();
    console.log(str);
    
      const datasetId = "box_skills";
 const tableId = "file";
 var date = new Date();
 date.setMonth(8)
 const datetime = BigQuery.datetime({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDay(),
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

       const rows = [{file_id: "Tom", file_name: "some file", read_token: "read token", write_token: "write_token", created: datetime, updated: datetime }];

      // Inserts data into a table
  bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
      console.log(`Inserted ${rows.length} rows`);
    })
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
          console.log('Insert errors:');
          err.errors.forEach(err => console.error(err));
        }
      } else {
        console.error('ERROR:', err);
      }
    });

    
}
