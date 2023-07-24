'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.integer('warehouse_id')
    })
  }

  down () {
    this.table('orders', (table) => {
      table.dropColumn('warehouse_id')
    })
  }
}

module.exports = OrderSchema
