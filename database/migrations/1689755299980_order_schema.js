'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('customer_id')
      table.integer('product_item_id')
      table.integer('amount')
      table.date('order_date')
      table.string('order_status')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderSchema
