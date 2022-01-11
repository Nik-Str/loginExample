import { controllPassword } from '../modules/main.js';

//------------LOG IN---------------------
//Controlls if login-username is valid or containes invalid characters
document.querySelector('#loginName').addEventListener('keyup', () => {
  //Variables
  let username = document.querySelector('#loginName');
  let loginBtn = document.querySelector('#loginBtn');
  const format = /[^A-Za-z0-9]/;
  const alert = document.querySelector('#loginAlert');
  const alertMessage = document.querySelector('#loginAlertMessage');
  //If special characters, show alert, else display none
  if (format.test(username.value) !== false) {
    alert.style.display = 'block';
    alertMessage.innerHTML =
      '<p>"Username" can only contain <strong>letters</strong> and <strong>numbers</strong>!</p>';
    username.style.border = 'thick solid #f8d7da';
    loginBtn.disabled = true;
  } else {
    username.style.border = '1px solid #ced4da';
    alert.style.display = 'none';
    loginBtn.disabled = false;
  }
});

//Login
document.querySelector('#loginBtn').addEventListener('click', () => {
  //Variables
  let username = document.querySelector('#loginName');
  let password = document.querySelector('#loginPass');
  let loginBtn = document.querySelector('#loginBtn');
  const alert = document.querySelector('#loginAlert');
  const alertMessage = document.querySelector('#loginAlertMessage');
  const alertSpan = document.querySelector('#loginAlertSpan');

  //Resets border if click on input and password
  const addClick = [password, username];
  addClick.forEach((element) => {
    element.addEventListener('click', () => {
      element.style.border = '1px solid #ced4da';
    });
  });
  //Remove alert if press key on inp field
  password.addEventListener('keyup', () => {
    alert.style.display = 'none';
  });
  // Always close allert message when submit modal
  alert.style.display = 'none';

  //Controll username
  if (username.value !== '') {
    //Controll password
    if (password.value !== '') {
      //Fetch function
      fetch('/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.value, password: password.value }),
      })
        .then((response) => {
          //Username doesn't exist
          if (response.status === 404) {
            username.style.border = 'thick solid #f8d7da';
            return response.json();
            // Incorrect password
          } else if (response.status === 401) {
            password.style.border = 'thick solid #f8d7da';
            return response.json();
            //To many failed login attemps
          } else if (response.status === 403) {
            //Disable username inp
            username.disabled = true;
            username.style.backgroundColor = '#e2e3e5';
            //Disable login inp
            password.disabled = true;
            password.style.backgroundColor = '#e2e3e5';
            //Disable btn and change color
            loginBtn.disabled = true;
            loginBtn.className = 'btn btn-secondary rounded-pill';
            alert.className = 'alert alert-secondary';
            alertSpan.innerHTML = 'gpp_bad';
            return response.json();
            //Login success
          } else if (response.status === 201) {
            username.disabled = true;
            password.disabled = true;
            username.style.backgroundColor = '#cfe2ff';
            password.style.backgroundColor = '#cfe2ff';
            loginBtn.disabled = true;
            setTimeout(() => {
              window.location.href = '/home';
            }, 1500);
            alert.className = 'alert alert-success';
            alertSpan.innerHTML = 'done';
            return response.json();
            //Error
          } else {
            throw new Error('Something went wrong. Please refresh page or try again.');
          }
        })
        .then((response) => {
          alert.style.display = 'block';
          alertMessage.innerHTML = `<p>${response.message}</p>`;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      password.style.border = 'thick solid #f8d7da';
    }
  } else {
    username.style.border = 'thick solid #f8d7da';
  }
});

//-------------SIGN UP-------------------
//Controlls if sign up username is valid or containes invalid characters
document.querySelector('#signupName').addEventListener('keyup', () => {
  //Variables
  let username = document.querySelector('#signupName');
  let loginBtn = document.querySelector('#signupBtn');
  const format = /[^A-Za-z0-9]/;
  const alert = document.querySelector('#signupAlert');
  const alertMessage = document.querySelector('#signupAlertMessage');
  const alertSpan = document.querySelector('#signupAlertSpan');
  //If special characters, show alert, else display none
  if (format.test(username.value) !== false) {
    alertSpan.innerHTML = 'warning';
    alert.className = 'alert alert-danger';
    alert.style.display = 'block';
    alertMessage.innerHTML =
      '<p>"Username" can only contain <strong>letters</strong> and <strong>numbers</strong>!</p>';
    username.style.border = 'thick solid #f8d7da';
    loginBtn.disabled = true;
  } else {
    username.style.border = '1px solid #ced4da';
    alert.style.display = 'none';
    loginBtn.disabled = false;
  }
});

//Controll if "password" and "password repeat" match, and contains both letters,
//numbers and special characters and minimum of 8 characters long
controllPassword('#signupPass', '#signupPassRep', '#signupBtn');

//Sign up
document.querySelector('#signupBtn').addEventListener('click', () => {
  //Variables
  let email = document.querySelector('#signupEmail');
  let username = document.querySelector('#signupName');
  let password = document.querySelector('#signupPass');
  let passRep = document.querySelector('#signupPassRep');
  let signupBtn = document.querySelector('#signupBtn');
  const alert = document.querySelector('#signupAlert');
  const alertMessage = document.querySelector('#signupAlertMessage');
  const alertSpan = document.querySelector('#signupAlertSpan');

  //Resets border if click on input and password
  const addClick = [password, passRep, username, email];
  addClick.forEach((element) => {
    element.addEventListener('click', () => {
      element.style.border = '1px solid #ced4da';
    });
  });
  //Remove alert if press key on inp field
  let keyUp = [password, passRep, email];
  keyUp.forEach((element) => {
    element.addEventListener('keyup', () => {
      alert.style.display = 'none';
    });
  });
  // Always close allert message when submit modal
  alert.style.display = 'none';

  //Controll Email
  if (email.value !== '') {
    //Controll username
    if (username.value !== '') {
      //Controll password
      if (password.value !== '') {
        //fetch
        fetch('/user', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value, username: username.value, password: password.value }),
        })
          .then((response) => {
            //Email already registered
            if (response.status === 409) {
              email.style.border = 'thick solid #f8d7da';
              return response.json();
              //Username is invalid/already exist
            } else if (response.status === 406) {
              username.style.border = 'thick solid #f8d7da';
              return response.json();
              //Account created successful
            } else if (response.status === 201) {
              email.disabled = true;
              username.disabled = true;
              password.disabled = true;
              passRep.disabled = true;
              signupBtn.disabled = true;
              email.style.backgroundColor = '#cfe2ff';
              username.style.backgroundColor = '#cfe2ff';
              setTimeout(() => {
                window.location.href = '/home';
              }, 2000);
              alert.className = 'alert alert-success';
              alertSpan.innerHTML = 'done';
              return response.json();
              //Error
            } else {
              throw new Error('Something went wrong. Please refresh page or try again.');
            }
          })
          .then((response) => {
            alert.style.display = 'block';
            alertMessage.innerHTML = `<p>${response.message}</p>`;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        password.style.border = 'thick solid #f8d7da';
      }
    } else {
      username.style.border = 'thick solid #f8d7da';
    }
  } else {
    email.style.border = 'thick solid #f8d7da';
  }
});

//Reset password
document.querySelector('#resetBtn').addEventListener('click', () => {
  //Variables
  let email = document.querySelector('#resetEmail');
  let key = document.querySelector('#resetKey');
  let password = document.querySelector('#resetPass');
  let passRep = document.querySelector('#resetPassRep');
  let resetBtn = document.querySelector('#resetBtn');
  const alert = document.querySelector('#resetAlert');
  const alertMessage = document.querySelector('#resetAlertMessage');
  const alertSpan = document.querySelector('#resetAlertSpan');
  const keyDiv = document.querySelector('#resetKeyDiv');
  const passDiv = document.querySelector('#resetPassDiv');

  //Resets border if click on input and password
  const addClick = [password, passRep, key, email];
  addClick.forEach((element) => {
    element.addEventListener('click', () => {
      element.style.border = '1px solid #ced4da';
    });
  });
  //Remove alert if press key on inp field
  let keyUp = [email, key];
  keyUp.forEach((element) => {
    element.addEventListener('keyup', () => {
      alert.style.display = 'none';
    });
  });
  // Always close allert message when submit modal
  alert.style.display = 'none';

  //On paste key
  key.addEventListener('paste', () => {
    key.style.border = 'thick solid #cfe2ff';
    passDiv.style.display = 'block';
    controllPassword('#resetPass', '#resetPassRep', '#resetBtn');
  });

  //Controll email
  if (resetBtn.innerHTML === 'Send') {
    if (email.value !== '') {
      //fetch
      fetch('/user/reset', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.value }),
      })
        .then((response) => {
          //Email not registered
          if (response.status === 404) {
            email.style.border = 'thick solid #f8d7da';
            return response.json();
            //Mail has been send
          } else if (response.status === 201) {
            email.disabled = true;
            email.style.backgroundColor = '#cfe2ff';
            keyDiv.style.display = 'block';
            resetBtn.innerHTML = 'Reset';
            return null;
            //Error
          } else {
            throw new Error('Something went wrong. Please refresh page or try again.');
          }
        })
        .then((response) => {
          if (response !== null) {
            alert.style.display = 'block';
            alertMessage.innerHTML = `<p>${response.message}</p>`;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      email.style.border = 'thick solid #f8d7da';
    }
  } else if (resetBtn.innerHTML === 'Reset') {
    //Controll key
    if (key.value !== '') {
      //Controll password
      if (password.value !== '') {
        //fetch
        fetch('/user/reset', {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: password.value, key: key.value }),
        })
          .then((response) => {
            //If invalid reset key
            if (response.status === 404) {
              key.style.border = 'thick solid #f8d7da';
              return response.json();
              //If successful reset
            } else if (response.status === 201) {
              key.disabled = true;
              password.disabled = true;
              passRep.disabled = true;
              resetBtn.disabled = true;
              passRep.style.border = '1px solid #ced4da';
              key.style.backgroundColor = '#cfe2ff';
              setTimeout(() => {
                window.location.href = '/';
              }, 4000);
              alert.className = 'alert alert-success';
              alertSpan.innerHTML = 'done';
              return response.json();
              //Error
            } else {
              throw new Error('Something went wrong. Please refresh page or try again.');
            }
          })
          .then((response) => {
            alert.style.display = 'block';
            alertMessage.innerHTML = `<p>${response.message}</p>`;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        password.style.border = 'thick solid #f8d7da';
      }
    } else {
      key.style.border = 'thick solid #f8d7da';
    }
  }
});
