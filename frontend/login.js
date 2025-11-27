document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const signUpData = {
      first_name: document.getElementById('firstname').value,
      last_name: document.getElementById('lastname').value,
      contact: document.getElementById('contact').value,
      email: document.getElementById('signup-email').value,
      password: document.getElementById('signup-password').value
    };

    fetch('http://localhost:3000/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(data.message)
            window.location.href = "home.html";
        } else {
            alert('User already exists!');
        }
    })
    .catch(err => console.error('Insert failed:', err));
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const who = 'user';
  
    fetch('http://localhost:3000/user-dba-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, who })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = "home.html";
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error('Login failed:', err));
});