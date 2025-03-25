function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username && password) {
        localStorage.setItem('authToken', 'dummyToken');
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill in all fields.');
    }
}

function signup() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

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
