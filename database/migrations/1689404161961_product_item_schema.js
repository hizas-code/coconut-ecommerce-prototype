'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemSchema extends Schema {
  up () {
    this.table('product_items', (table) => {
      table.string('code')
    })
  }

  down () {
    this.table('product_items', (table) => {
      table.dropColumn('code')
    })
  }
}

module.exports = ProductItemSchema
