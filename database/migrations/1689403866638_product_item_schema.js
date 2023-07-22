'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemSchema extends Schema {
  up () {
    this.table('product_items', (table) => {
      table.dropColumn('product_id')
      table.string('product_code')
    })
  }

  down () {
    this.table('product_items', (table) => {
      table.integer('product_id')
      table.dropColumn('product_code')
    })
  }
}

module.exports = ProductItemSchema
