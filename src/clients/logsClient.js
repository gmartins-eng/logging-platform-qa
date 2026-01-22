const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

//sends the log to the plataform
async function sendLog(token, message) {
  try {
    const response = await axios.post(
      `${BASE_URL}/logs`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      }
    );

    return response.data.correlationId;
  } catch (error) {
    throw new Error('Failed to send log');
  }
}

//search for the log using correlationId
async function getLogStatus(correlationId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/logs/${correlationId}`,
      { timeout: 5000 }
    );

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch log status');
  }
}

module.exports = {
  sendLog,
  getLogStatus
};
