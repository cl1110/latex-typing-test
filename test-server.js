// Simple test to check if server is reachable
const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:5000/api/auth/test', {
      timeout: 5000
    });
    console.log('✅ Server is running!', response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start it with: cd server && npm run dev');
    } else if (error.response?.status === 404) {
      console.log('✅ Server is running but route not found (this is expected)');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testServer();
