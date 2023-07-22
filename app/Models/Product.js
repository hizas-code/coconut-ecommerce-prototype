'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {

  productItems(){
    return this.hasMany('App/Models/ProductItem', 'code', 'product_code')
  }

}

module.exports = Product
