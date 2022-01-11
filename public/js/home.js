import { controllPassword } from '../modules/main.js';

// Logout
document.querySelector('#logoutBtn').addEventListener('click', () => {
  fetch('/user/logout', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 204) {
        window.location.href = '/';
      } else {
        throw new Error('Something went wrong. Please refresh page or try again.');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//Controll if "password" and "password repeat" match, and contains both letters,
//numbers and special characters and minimum of 8 characters long
controllPassword('#updatePassNew', '#updatePassNewRep', '#updateBtn');

//Uppdate password
document.querySelector('#updateBtn').addEventListener('click', () => {
  //Variables
  let oldPass = document.querySelector('#updatePassOld');
  let newPass = document.querySelector('#updatePassNew');
  let passRep = document.querySelector('#updatePassNewRep');
  let updateBtn = document.querySelector('#updateBtn');
  const alert = document.querySelector('#updateAlert');
  const alertMessage = document.querySelector('#updateAlertMessage');
  const alertSpan = document.querySelector('#updateAlertSpan');

  //Resets border if click on input and password
  const addClick = [oldPass, newPass];
  addClick.forEach((element) => {
    element.addEventListener('click', () => {
      element.style.border = '1px solid #ced4da';
    });
  });
  //Remove alert if press key on inp field
  oldPass.addEventListener('keyup', () => {
    alert.style.display = 'none';
  });
  // Always close allert message when submit modal
  alert.style.display = 'none';

  //Controll old password
  if (oldPass.value !== '') {
    //Controll new password
    if (newPass.value !== '') {
      //Fetch
      fetch('/user', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: oldPass.value, newPassword: newPass.value }),
      })
        .then((response) => {
          //Something went wrong, or session has ended
          if (response.status === 404) {
            oldPass.disabled = true;
            newPass.disabled = true;
            passRep.disabled = true;
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
            return response.json();
            //Incorrect password
          } else if (response.status === 401) {
            oldPass.style.border = 'thick solid #f8d7da';
            return response.json();
            //Successful password update
          } else if (response.status === 201) {
            oldPass.disabled = true;
            newPass.disabled = true;
            passRep.disabled = true;
            updateBtn.disabled = true;
            oldPass.style.backgroundColor = '#cfe2ff';
            setTimeout(() => {
              window.location.href = '/';
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
          alertMessage.innerHTML = `<p>${response.message}</p>`;
          alert.style.display = 'block';
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      newPass.style.border = 'thick solid #f8d7da';
    }
  } else {
    oldPass.style.border = 'thick solid #f8d7da';
  }
});

//Delete account
document.querySelector('#deleteBtn').addEventListener('click', () => {
  //Variables
  let password = document.querySelector('#deletePass');
  let deleteBtn = document.querySelector('#deleteBtn');
  const alert = document.querySelector('#deleteAlert');
  const alertMessage = document.querySelector('#deleteAlertMessage');
  const alertSpan = document.querySelector('#deleteAlertSpan');

  //Resets border if click on input and password
  password.addEventListener('click', () => {
    password.style.border = '1px solid #ced4da';
  });
  //Remove alert if press key on inp field
  password.addEventListener('keyup', () => {
    alert.style.display = 'none';
  });
  // Always close allert message when submit modal
  alert.style.display = 'none';

  //Controll password
  if (password.value !== '') {
    //fetch
    fetch('/user', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    })
      .then((response) => {
        //Something went wrong, or session has ended
        if (response.status === 404) {
          password.disabled = true;
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return response.json();
          //Incorrect password
        } else if (response.status === 401) {
          password.style.border = 'thick solid #f8d7da';
          return response.json();
          //Account delete successful
        } else if (response.status === 202) {
          password.disabled = true;
          deleteBtn.disabled = true;
          password.style.backgroundColor = '#cfe2ff';
          setTimeout(() => {
            window.location.href = '/';
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
        alertMessage.innerHTML = `<p>${response.message}</p>`;
        alert.style.display = 'block';
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    password.style.border = 'thick solid #f8d7da';
  }
});
