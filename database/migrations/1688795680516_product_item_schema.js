'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductItemSchema extends Schema {
  up () {
    this.create('product_items', (table) => {
      table.increments()
      table.integer('product_id')
      table.double('price')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('product_items')
  }
}

module.exports = ProductItemSchema
