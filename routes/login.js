require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Auth = require('../models/auth');
const Reset = require('../models/reset');
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');

//Email options (For password reset)
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  tls: {
    ciphers: 'SSLv3',
  },
  auth: {
    user: process.env.SERVER_EMAIL_ADDRESS,
    pass: process.env.SERVER_EMAIL_PASSWORD,
  },
});

//Controll the number of failed attempts for login
const authentication = async (req, res, next) => {
  try {
    let controll = await Auth.findOne({ username: req.body.username });
    if (controll === null) {
      return next();
    } else {
      if (controll.attempts < 5) {
        return next();
      } else {
        res.status(403).json({
          message: `Too many failed login attempts! <br> Account: <strong>${req.body.username} frozen in 30 minutes</strong>.`,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
};

//Uppdates the number of failed attempts for login
const attempts = async (username) => {
  let controll = await Auth.findOne({ username: username });
  if (controll === null) {
    let newAttempts = new Auth({
      username: username,
      attempts: 1,
    });
    await newAttempts.save();
  } else {
    await Auth.findOneAndUpdate({ username: username }, { $inc: { attempts: 1 } });
  }
};

//Login and session controll
const userControll = async (req, res, next) => {
  //Controll if session user is logged in
  if (req.session.loggedin === true) {
    //Get session user info from db
    let checkUser = await User.findOne({ _id: req.session.userid }, 'password');
    if (checkUser !== null) {
      //Decrypt and controll if password/old password is correct
      let passDB = CryptoJS.AES.decrypt(checkUser.password, process.env.CRYPTO_SECRET);
      let originalPass = passDB.toString(CryptoJS.enc.Utf8);
      if (req.body.password === originalPass) {
        next();
      } else {
        res.status(401).json({ message: '<strong>Incorrect password</strong>, try again.' });
      }
    } else {
      res.status(404).json({ message: '<strong>Something went wrong</strong>, uppdate page and try again.' });
    }
  } else {
    res.status(404).json({ message: '<strong>session has ended</strong>, uppdate page or try again.' });
  }
};

//Login
router.post('/login', authentication, async (req, res) => {
  try {
    //Controll if username exist
    let checkUser = await User.findOne({ username: req.body.username }, '_id password');
    if (checkUser !== null) {
      //Decrypt and controll if password is correct
      let passDB = CryptoJS.AES.decrypt(checkUser.password, process.env.CRYPTO_SECRET);
      let originalPass = passDB.toString(CryptoJS.enc.Utf8);
      if (req.body.password === originalPass) {
        //Creates a login session
        req.session.loggedin = true;
        req.session.userid = checkUser.id;
        res.status(201).json({ message: '<strong>Login successful!</strong>' });
      } else {
        await attempts(req.body.username);
        res.status(401).json({ message: 'Incorrect <strong>password</strong>, try again.' });
      }
    } else {
      res.status(404).json({ message: '<strong>Username</strong> does not exist, try again or create new account.' });
    }
  } catch (err) {
    res.status(500).end();
    console.log(err);
  }
});

//Create Account
router.post('/', async (req, res) => {
  try {
    //Controll if email already exist.
    let checkEmail = await User.exists({ email: req.body.email });
    if (checkEmail === false) {
      //Controll if username already exist
      let checkUsername = await User.exists({ username: req.body.username });
      //Controll if username contains special/invalid characters
      const format = /[^A-Za-z0-9]/;
      if (checkUsername === false && format.test(req.body.username) === false) {
        //Encrypts the password
        let encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET).toString();
        //Create new user document
        let newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: encryptedPassword,
        });
        //Saves the new user in db
        newUser.save((err, docs) => {
          if (err) throw err;
          //Creates a login session, send back session cookie to client, and redirect to home page
          req.session.loggedin = true;
          req.session.userid = docs.id;
          res.status(201).json({
            message: `Account: <strong>${req.body.username}</strong>, was <strong>created succesfully</strong>!`,
          });
        });
      } else {
        res.status(406).json({ message: '<strong>Username</strong> already exist or is invalid, choose another one.' });
      }
    } else {
      res
        .status(409)
        .json({ message: '<strong>Email</strong> is already registered, try to log in or choose another one.' });
    }
  } catch (err) {
    res.status(500).end();
    console.log(err);
  }
});

//Uppdate Password
router.patch('/', userControll, async (req, res) => {
  try {
    //Encrypts the new password before update
    let encryptedNewPass = CryptoJS.AES.encrypt(req.body.newPassword, process.env.CRYPTO_SECRET).toString();
    await User.findOneAndUpdate({ _id: req.session.userid }, { password: encryptedNewPass });
    res.status(201).json({ message: '<strong>Password update was successful!</strong>' });
  } catch (err) {
    res.status(500).end();
    console.log(err);
  }
});

//Delete Account
router.delete('/', userControll, async (req, res) => {
  try {
    //Delete user account from db and remove session
    await User.findOneAndDelete({ _id: req.session.userid });
    req.session.destroy((err) => {
      if (err) throw err;
      res.status(202).json({ message: '<strong>Account</strong> was <strong>successfully deleted</strong>!' });
    });
  } catch (err) {
    res.status(500).end();
    console.log(err);
  }
});

//Logout
router.get('/logout', (req, res) => {
  try {
    //Controll if session user is logged in
    if (req.session.loggedin === true) {
      //End session and remove client cookie
      req.session.destroy((err) => {
        if (err) throw err;
        req.session = null;
        res.status(204).clearCookie('connect.sid', { path: '/' }).end();
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).end();
    console.log(err);
  }
});

//Reset password or/and username (stage 1, get reset key)
router.post('/reset', async (req, res) => {
  try {
    //Check if email is registrered
    let checkUser = await User.findOne({ email: req.body.email }, 'username');
    if (checkUser !== null) {
      //Remove any previously reset linked to the same email
      await Reset.deleteMany({ email: req.body.email });

      //Create reset key
      let random = 'random' + Math.random();
      let key = CryptoJS.AES.encrypt(random, process.env.CRYPTO_SECRET).toString();

      //Save key in db
      let newReset = new Reset({
        email: req.body.email,
        key: key,
      });
      await newReset.save();

      //Send key to user email
      await transporter.sendMail({
        from: `"Account reset "<${process.env.SERVER_EMAIL_ADDRESS}>`,
        to: req.body.email,
        subject: 'Account reset information',
        html: `<b>Username:</b> ${checkUser.username} <br><b>Password reset key:</b> ${key}`,
      });

      //Send response
      res.status(201).json({
        message: '<strong>An Email</strong> with account reset information <strong>has been sent to you</strong>. ',
      });
    } else {
      res.status(404).json({
        message: '<strong>Email</strong> is <strong>not registered</strong>, try again or create new account.',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

//Reset password or/and username (stage 2, change password)
router.patch('/reset', async (req, res) => {
  try {
    //Controll if key exist / is active
    let keyControll = await Reset.findOne({ key: req.body.key }, 'email');
    if (keyControll !== null) {
      //Encrypts the password
      let encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET).toString();
      //Update password in db
      await User.findOneAndUpdate({ email: keyControll.email }, { password: encryptedPassword });
      res.status(201).json({ message: '<strong>Password reset was successful!</strong>' });
    } else {
      res.status(404).json({ message: '<strong>Invalid reset key</strong>, refresh page or try again.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = router;
