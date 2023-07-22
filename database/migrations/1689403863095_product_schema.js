'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.table('products', (table) => {
      table.string('code')
    })
  }

  down () {
    this.table('products', (table) => {
      table.dropColumn('code')
    })
  }
}

module.exports = ProductSchema
