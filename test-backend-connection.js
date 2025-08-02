const axios = require('axios');

async function testBackendConnection() {
  console.log('Testing backend connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get('https://localhost:3000/api/health', {
      timeout: 5000
    });
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test CSRF token endpoint
    const csrfResponse = await axios.get('https://localhost:3000/api/csrf-token', {
      timeout: 5000,
      withCredentials: true
    });
    console.log('✅ CSRF token endpoint working:', csrfResponse.data.csrfToken ? 'Token received' : 'No token');
    
    console.log('🎉 Backend is accessible and working!');
    
  } catch (error) {
    console.error('❌ Backend connection failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   - Backend server is not running on port 3000');
      console.error('   - Start the backend with: cd backend && npm start');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   - Cannot resolve localhost');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   - Request timed out - backend might be slow to respond');
    } else {
      console.error('   - Error:', error.message);
    }
  }
}

testBackendConnection(); 