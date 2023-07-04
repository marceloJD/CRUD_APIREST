document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, pass })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.result.ok === true) {
          if (data.result.role === 2) {
            window.location.href = '../adminApp';
          } else if (data.result.role === 1) {
            window.location.href = '../userApp';
          }
        } else {
          alert('Credenciales erroneas');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });