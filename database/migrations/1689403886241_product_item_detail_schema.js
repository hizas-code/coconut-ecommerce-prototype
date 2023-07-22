'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemDetailSchema extends Schema {
  up () {
    this.table('product_item_details', (table) => {
      table.string('product_item_code')
    })
  }

  down () {
    this.table('product_item_details', (table) => {
      table.dropColumn('product_item_code')
    })
  }
}

module.exports = ProductItemDetailSchema
