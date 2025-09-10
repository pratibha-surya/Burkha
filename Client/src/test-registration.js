// Test script to verify registration API
import axios from 'axios';

const testRegistration = async () => {
  const testData = {
    firmName: "Test Company Ltd",
    contactName: "Test User",
    contactType: "Owner",
    mobile1: "9876543210",
    mobile2: "9876543211",
    whatsapp: "9876543210",
    email: "test@example.com",
    state: "Maharashtra",
    city: "Mumbai",
    address: "123 Test Street, Mumbai",
    password: "testpassword123",
    limit: 50000,
    discount: 10
  };

  try {
    console.log('Testing registration with data:', testData);
    const response = await axios.post('http://localhost:8080/user/register', testData);
    console.log('✅ Registration successful:', response.data);
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
  }
};

// Run the test
testRegistration();



