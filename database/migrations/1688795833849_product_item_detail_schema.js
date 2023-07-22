'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemDetailSchema extends Schema {
  up () {
    this.create('product_item_details', (table) => {
      table.increments()
      table.integer('product_item_id')
      table.string('item_detail') //Size, Color
      table.string('item_detail_name')// Red, Blue or XL, L, M
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('product_item_details')
  }
}

module.exports = ProductItemDetailSchema
