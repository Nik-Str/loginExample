export function controllPassword(pass1, pass2, btn) {
  let password = document.querySelector(pass1);
  let passRep = document.querySelector(pass2);
  let signupBtn = document.querySelector(btn);
  const lower = /[a-z]/;
  const upper = /[A-Z]/;
  const numbers = /[0-9]/;
  const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~€]/;

  // Controll if "password" and "password repeat" match, and contains both letters,
  // numbers and special characters and minimum of 8 characters long
  password.addEventListener('keyup', () => {
    if (
      lower.test(password.value) &&
      upper.test(password.value) &&
      numbers.test(password.value) &&
      special.test(password.value) &&
      password.value.length >= 8
    ) {
      password.style.backgroundColor = '#cfe2ff';
    } else {
      password.style.backgroundColor = '#fff';
      signupBtn.disabled = true;
    }
  });

  passRep.addEventListener('keyup', () => {
    if (
      lower.test(passRep.value) &&
      upper.test(passRep.value) &&
      numbers.test(passRep.value) &&
      special.test(passRep.value) &&
      passRep.value.length >= 8 &&
      password.value === passRep.value
    ) {
      passRep.style.backgroundColor = '#cfe2ff';
      signupBtn.disabled = false;
    } else {
      passRep.style.backgroundColor = '#fff';
      signupBtn.disabled = true;
    }
  });
}
