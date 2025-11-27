document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
    const who = 'dba';
  
    fetch('http://localhost:3000/user-dba-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, who })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            window.location.href = "dbahome.html";
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error('Login failed:', err));
});