'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProductItem extends Model {

  productItemDetails(){
    return this.hasMany('App/Models/ProductItemDetail', 'code', 'product_item_code')
  }

  stock(){
    return this.hasMany('App/Models/Stock', 'id', 'product_item_id')
  }

}

module.exports = ProductItem
