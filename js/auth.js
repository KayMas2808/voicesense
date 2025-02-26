// auth.js
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Simple validation
    if (username && password) {
      localStorage.setItem('authToken', 'dummyToken');
      window.location.href = 'dashboard.html';
    } else {
      alert('Please fill in all fields.');
    }
  }
  
  function signup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    // Simple validation
    if (username && email && password && confirmPassword) {
      if (password === confirmPassword) {
        localStorage.setItem('authToken', 'dummyToken');
        window.location.href = 'dashboard.html';
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  }