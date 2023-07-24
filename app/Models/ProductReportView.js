'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProductReportView extends Model {

  static get table () {
    return 'product_report_view'
  }

}

module.exports = ProductReportView
