'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WarehouseSchema extends Schema {
  up () {
    this.create('warehouses', (table) => {
      table.increments()
      table.string('name')
      table.string('address')
      table.string('city')
      table.string('description')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('warehouses')
  }
}

module.exports = WarehouseSchema
