'use strict'

const Stock = use('App/Models/Stock')
const Order = use('App/Models/Order')
const Product = use('App/Models/Product')
const ProductItem = use('App/Models/ProductItem')
const ProductReportView = use('App/Models/ProductReportView')
const BasicService = use('App/Services/BasicService')

class StockController {

  async add({ request, response }){
    const body = request.only([ 'product_item_id', 'warehouse_id', 'quantity', 'supplier' ])
    try {
      const result = await Stock.create(body)
      return response.status(200).json({ success: true, result: result, message: 'Add stock successful.'})
    } catch(error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async report({ request, response }){
    const params = request.only([ 'page', 'limit', 'search' ])
    try {
      const query = ProductReportView.query().where('deleted_at', null)
      if(params.search) query.whereRaw(`name ilike '%${params.search}%'`)
      const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 5)
      return response.status(200).json({ success: true, result: result, message: 'Get Product Report successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async reportDetail({ params, response }){
    try {
      // const result = []
      const product = await Product.query().where('deleted_at', null).where('id', params.id).first()
      const productItems = (await ProductItem.query().where('deleted_at', null).where('product_code', product.code).fetch()).toJSON()
      const productItemIds = []
      for(const productItem of productItems) productItemIds.push(productItem.id)
      const stocks = (await Stock.query().where('deleted_at', null).whereIn('product_item_id', productItemIds).with('warehouse').with('productItem', builder => builder.with('productItemDetails')).fetch()).toJSON()
      const orders = (await Order.query().where('deleted_at', null).whereIn('product_item_id', productItemIds).with('warehouse').with('productItem', builder => builder.with('productItemDetails')).fetch()).toJSON()
      const mappingWarehouse = {}
      for(const stock of stocks){
        if(!(stock.warehouse.id in mappingWarehouse)) {
          mappingWarehouse[stock.warehouse.id] = { name: stock.warehouse.name, product_items: {}, total_quantity: 0 }
        }
        mappingWarehouse[stock.warehouse.id].total_quantity += stock.quantity
        if(!(stock.product_item_id in mappingWarehouse[stock.warehouse.id].product_items)) {
          mappingWarehouse[stock.warehouse.id].product_items[stock.product_item_id] = { 
            name: '',
            quantity: 0
          }
        }
        mappingWarehouse[stock.warehouse.id].product_items[stock.product_item_id].quantity += stock.quantity
        for(const item of stock.productItem.productItemDetails) {
          mappingWarehouse[stock.warehouse.id].product_items[stock.product_item_id].name += item.item_detail + ' ' + item.item_detail_name + ' ' 
        }
      }
      for(const order of orders){
        mappingWarehouse[order.warehouse.id] -= order.amount
        mappingWarehouse[order.warehouse.id].stocks[order.product_item_id].quantity -= order.amount
      }
      const result = Object.values(mappingWarehouse)
      for(const data of result) data.product_items = Object.values(data.product_items)
      return response.status(200).json({ success: true, result: result, message: 'Get Product Report Detail successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }
  
}

module.exports = StockController
