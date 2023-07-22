'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SalesSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table.increments()
      table.integer('product_id')
      table.integer('product_item_id')
      table.integer('warehouse_id')
      table.integer('quantity')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SalesSchema
