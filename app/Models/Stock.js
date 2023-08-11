'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Stock extends Model {

  warehouse(){
    return this.hasOne('App/Models/Warehouse', 'warehouse_id', 'id')
  }

  productItem(){
    return this.hasOne('App/Models/ProductItem', 'product_item_id', 'id')
  }

}

module.exports = Stock
