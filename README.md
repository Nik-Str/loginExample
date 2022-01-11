# Login system

## General Info

A easy to implement login system with the most commun features!

- Log In
- Create Account
- Reset Account / Password via Email
- Log Out
- Update Password
- Delete Account

## Technologies

- [Express](https://github.com/expressjs/express)
- [Express-session](https://github.com/expressjs/session)
- [Connect-mongo](https://github.com/jdesboeufs/connect-mongo)
- [Cors](https://github.com/expressjs/cors)
- [Crypto-js](https://github.com/brix/crypto-js)
- [Mongoose](https://github.com/Automattic/mongoose)
- [Nodemailer](https://github.com/nodemailer/nodemailer)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Sass](https://github.com/sass/sass)

## Installation

Download or clone this repository, then run the following command:

```
$ npm install
```

Create a .env file in directory and add:

- DATABASE_URL
- CRYPTO_SECRET
- SESSION_SECRET
- SERVER_EMAIL_ADDRESS
- SERVER_EMAIL_PASSWORD

When all that is done, you're all set up and ready to use the system!
I recommend to set up nodemon and eslint for easy debug and usage.
Server is listening on localhost:3000 in dev enviroment.
Run the following command for server start:

```
$ npm run devStart
```

## Directory

```
.
├── .env
├── .eslintrc.json
├── .gitignore
├── node_modules
├── README.md
├── app.js
├── models
│   ├── auth.js
│   ├── reset.js
│   └── user.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   ├── style.css
│   │   └── style.css.map
│   ├── index.html
│   ├── js
│   │   ├── home.js
│   │   └── index.js
│   ├── modules
│   │   └── main.js
│   ├── pages
│   │   └── home.html
│   └── scss
│       └── style.scss
└── routes
    ├── login.js
    └── main.js
```

## Author

- Created by [Niklas Strömberg](https://www.linkedin.com/in/niklas-str%C3%B6mberg-59b428169)
