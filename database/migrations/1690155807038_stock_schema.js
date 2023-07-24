'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.table('stocks', (table) => {
      table.string('supplier')
    })
  }

  down () {
    this.table('stocks', (table) => {
      table.dropColumn('supplier')
    })
  }
}

module.exports = StockSchema
