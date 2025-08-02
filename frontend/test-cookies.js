// Test script for cookie implementation
// Run this in the browser console to test the cookie functions

// Import the cookie functions (this would need to be adapted for browser testing)
// For now, we'll test the basic functionality

console.log('Testing Cookie Implementation...');

// Test basic cookie operations
function testBasicCookies() {
  console.log('=== Testing Basic Cookie Operations ===');
  
  // Test setCookie
  document.cookie = 'testCookie=testValue; path=/';
  console.log('Set test cookie');
  
  // Test getCookie
  const testValue = document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === 'testCookie' ? decodeURIComponent(parts[1]) : r
  }, '');
  console.log('Retrieved test cookie:', testValue);
  
  // Test removeCookie
  document.cookie = 'testCookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  console.log('Removed test cookie');
  
  // Verify removal
  const afterRemoval = document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === 'testCookie' ? decodeURIComponent(parts[1]) : r
  }, '');
  console.log('After removal:', afterRemoval);
}

// Test appointment data cookies
function testAppointmentCookies() {
  console.log('=== Testing Appointment Cookie Operations ===');
  
  // Test setAppointmentData
  document.cookie = 'bookAppointmentWith=123; path=/';
  document.cookie = 'appointmentDate=2024-01-15; path=/';
  document.cookie = 'timeSlotId=456; path=/';
  console.log('Set appointment data cookies');
  
  // Test getAppointmentData
  const appointmentData = {
    doctorId: document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === 'bookAppointmentWith' ? decodeURIComponent(parts[1]) : r
    }, ''),
    appointmentDate: document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === 'appointmentDate' ? decodeURIComponent(parts[1]) : r
    }, ''),
    timeSlotId: document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === 'timeSlotId' ? decodeURIComponent(parts[1]) : r
    }, '')
  };
  console.log('Retrieved appointment data:', appointmentData);
  
  // Test clearAppointmentData
  document.cookie = 'bookAppointmentWith=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'appointmentDate=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'timeSlotId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  console.log('Cleared appointment data cookies');
}

// Test localStorage clearing
function testLocalStorageClearing() {
  console.log('=== Testing localStorage Clearing ===');
  
  // Set some test data
  localStorage.setItem('testKey', 'testValue');
  localStorage.setItem('anotherKey', 'anotherValue');
  console.log('Set localStorage data:', {
    testKey: localStorage.getItem('testKey'),
    anotherKey: localStorage.getItem('anotherKey')
  });
  
  // Clear localStorage
  localStorage.clear();
  console.log('Cleared localStorage');
  console.log('localStorage length after clearing:', localStorage.length);
}

// Test sessionStorage clearing
function testSessionStorageClearing() {
  console.log('=== Testing sessionStorage Clearing ===');
  
  // Set some test data
  sessionStorage.setItem('testKey', 'testValue');
  sessionStorage.setItem('anotherKey', 'anotherValue');
  console.log('Set sessionStorage data:', {
    testKey: sessionStorage.getItem('testKey'),
    anotherKey: sessionStorage.getItem('anotherKey')
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('Cleared sessionStorage');
  console.log('sessionStorage length after clearing:', sessionStorage.length);
}

// Run all tests
function runAllTests() {
  testBasicCookies();
  testAppointmentCookies();
  testLocalStorageClearing();
  testSessionStorageClearing();
  console.log('=== All Tests Completed ===');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testCookieImplementation = runAllTests;
  console.log('Test functions available. Run testCookieImplementation() to test.');
} 