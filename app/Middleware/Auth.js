'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const jwt = require('jsonwebtoken')
const Env = use('Env')
const User = use('App/Models/User')

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const token = request.headers().authorization ? request.headers().authorization.slice(7) : false
    try {
      if(token){
        const decodedToken = jwt.verify(token, Env.get('APP_KEY'))
        const user = await User.findBy('id', decodedToken.uid)
        if (!user) {
          return response.status(401).json({ success: false, data: {}, message: 'Invalid token.' })
        }        
      }
    } catch (error) {
      console.error(error)
      if(error.name == 'JsonWebTokenError') {
        return response.status(401).json({ success: false, data: {}, message: 'Invalid token.' })
      }
      else return response.status(500).json({ message: 'Unknown error occured.'})
    }
    
    await next()
  }
}

module.exports = Auth
