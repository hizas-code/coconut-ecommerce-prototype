'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemDetailSchema extends Schema {
  up () {
    this.table('product_item_details', (table) => {
      table.dropColumn('product_item_id')
    })
  }

  down () {
    this.table('product_item_details', (table) => {
      table.integer('product_item_id')
    })
  }
}

module.exports = ProductItemDetailSchema
