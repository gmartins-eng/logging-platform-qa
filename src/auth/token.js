const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function generateToken() {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token`,
      {},
      { timeout: 5000 }
    );

    return response.data.token;
  } catch (error) {
    throw new Error('Failed to generate auth token');
  }
}

module.exports = {
  generateToken
};
