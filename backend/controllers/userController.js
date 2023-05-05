const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// function created to return token from jwt package
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // attempt to login user in with the req properties, login function created in /models/userModel
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup user
const signupUser = async (req, res) => {

  // destructure the email and password properties from the req body obect
  const { email, password } = req.body

  try {
    // create a user with the req properties, signup function created in /models/userModel
    const user = await User.signup(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}


module.exports = { loginUser, signupUser }