'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WarehouseSchema extends Schema {
  up () {
    this.table('warehouses', (table) => {
      table.string('zip_code')
    })
  }

  down () {
    this.table('warehouses', (table) => {
      table.dropColumn('zip_code')
    })
  }
}

module.exports = WarehouseSchema
