'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductReportViewSchema extends Schema {
  up () {
    this.raw(`drop view if exists public.product_report_view;`)
    this.raw(`
    CREATE OR REPLACE VIEW public.product_report_view as
    SELECT 
       p.id,
        p.name,
        p.description,
        (COALESCE(stock_quantity, 0) - COALESCE(order_quantity, 0)) AS quantity,
        p.created_at,
        p.updated_at,
        p.deleted_at
    FROM
        products p
    LEFT JOIN (
        SELECT 
            pi.product_code,
            SUM(s.quantity) AS stock_quantity
        from product_items pi
        LEFT join stocks s ON pi.id = s.product_item_id
        GROUP by pi.product_code
    ) AS stock_subquery ON p.code = stock_subquery.product_code
    LEFT JOIN (
        SELECT 
            pi.product_code,
            SUM(o.amount) AS order_quantity
        from product_items pi
        LEFT join orders o ON pi.id = o.product_item_id
        GROUP by pi.product_code
    ) AS order_subquery ON p.code = order_subquery.product_code;
    `)
  }

  down () {
    this.raw(`drop view if exists public.product_report_view;`)
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
}

module.exports = ProductReportViewSchema
