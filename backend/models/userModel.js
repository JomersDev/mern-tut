const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
      required: true,
      unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static signup method
userSchema.statics.signup = async function(email, password) {
  
  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }
  //check if email is already in use
  const exists = await this.findOne({ email }) 

  if (exists) {
    throw Error('Email already in use')
  }
  
  // password hashing wiht bcrypt package
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  // creating user document in MongoDB with a valid email and hashed password
  const user = await this.create({ email, password: hash })

  return user
}

// create a static method called login
userSchema.statics.login = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  // find if the entered email exists in the database
  const user = await this.findOne({ email }) 

  if (!user) {
    throw Error('Incorrect email')
  }

  // compare plain text password entered with the hashed password on the user object using built in compare function
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  // if passwords match return the user object
  return user
}

module.exports = mongoose.model('User', userSchema)