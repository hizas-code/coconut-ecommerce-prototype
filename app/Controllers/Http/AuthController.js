'use strict'

const User = use('App/Models/User')

class AuthController {

  async register({ request, response }){
    const body = request.only(['username', 'email', 'password'])
    try {
      const user = await User.create(body)
      return response.status(200).json({ success: true, result: user, message: 'User registered successfully' })
    } catch(error){
      console.error(error)
      return response.status(400).json({ success: false, result: {}, message: 'Registration failed.' })
    }
  }

  async login({  auth, request, response }){
    const body = request.only([ 'username', 'password' ])
    try {
      const token = await auth.attempt(body.username , body.password)
      return response.status(200).json({ success: true, result: token, message: 'Logged in successfully.' })
    } catch (error) {
      console.error(error)
      if(error.name == 'UserNotFoundException' || error.name == 'PasswordMisMatchException') {
        return response.status(401).json({ success: false, result: {}, message: 'Invalid credentials.'})
      }
      else return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }    
  }

}

module.exports = AuthController
