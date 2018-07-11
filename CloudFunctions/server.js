/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

const express = require('express');
const app = express();
const boxSkills = require('./boxSkills.js');

app.get('/', boxSkills);

app.listen(3000, function() {
    console.log('Listening...');
});
