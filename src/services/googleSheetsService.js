const { google } = require('googleapis');
const { promisify } = require('util');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const CREDENTIALS_PATH = 'credentials.json';

async function loadCredentials() {
    const content = await promisify(fs.readFile)(CREDENTIALS_PATH);
    return JSON.parse(content);
}

async function authorize() {
    const credentials = await loadCredentials();
    const { client_email, private_key } = credentials;
    const auth = new google.auth.JWT(client_email, null, private_key, SCOPES);
    await auth.authorize();
    return auth;
}

async function getSheetData(spreadsheetId, range) {
    const auth = await authorize();
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE', // Changed to get the actual values
    });
    return res.data.values;
}

module.exports = { getSheetData };
