document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    // Simple authentication check (for demonstration purposes)
    if (username === 'admin' && password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
});

// Remove dark mode toggle button event listener
// document.getElementById('theme-toggle').addEventListener('click', function() {
//     document.body.classList.toggle('dark-mode');
//     localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
// });

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}
