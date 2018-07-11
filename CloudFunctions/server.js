/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const boxSkills = require('./boxSkills.js');

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', boxSkills);
