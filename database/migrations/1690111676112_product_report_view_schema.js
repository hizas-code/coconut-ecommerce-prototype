'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductReportViewSchema extends Schema {
  up () {
    this.raw(`
    CREATE OR REPLACE VIEW public.product_report_view
    AS SELECT p.id,
        p.name,
        p.description,
        sum(s.quantity) AS quantity,
        p.created_at,
        p.updated_at,
        p.deleted_at
       FROM products p
         LEFT JOIN product_items p2 ON p.code::text = p2.product_code::text
         LEFT JOIN stocks s ON s.product_item_id = p2.id AND s.deleted_at IS NULL
      WHERE p.deleted_at IS NULL AND p2.deleted_at IS NULL AND s.deleted_at IS NULL
      GROUP BY p.id;
    `)
  }

  down () {
    this.raw(`
      drop view if exists product_report_view;
    `)
  }
}

module.exports = ProductReportViewSchema
