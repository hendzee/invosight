'use strict'

class StoreUser {
  get rules () {
    return {
      first_name: 'required|alpha',
      last_name: 'required|alpha',
      address: 'required|string',
      email: 'required|email|unique:invosight_users,email',
      contact: 'required|unique:invosight_users,contact|integer'
    }
  }

  /** Error messages for each condition */
  get messages () {
    return {
      'first_name.alpha': 'first name must be alphabetic',
      'last_name.alpha': 'last name must be alphabetic',
      'email.unique': 'email already exist',
      'contact.unique': 'contact already exist',
      'contact.integer': 'contact must be numeric'
    }
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      message: errorMessages[0].message
    });
  }
}

module.exports = StoreUser
