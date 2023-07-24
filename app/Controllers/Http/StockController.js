'use strict'

const Stock = use('App/Models/Stock')
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
      const product = await Product.query().where('deleted_at', null).where('id', params.id).first()
      const productItems = (await ProductItem.query().where('deleted_at', null).where('product_code', product.code).fetch()).toJSON()
      const productItemIds = []
      for(const productItem of productItems) productItemIds.push(productItem.id)
      const stocks = (await Stock.query().where('deleted_at', null).whereIn('product_item_id', productItemIds).with('warehouse').fetch()).toJSON()
      const result = []
      for(const stock of stocks){
        result.push({ id: stock.warehouse.id, name: stock.warehouse.name, address: stock.warehouse.address, quantity: stock.quantity })
      }
      return response.status(200).json({ success: true, result: result, message: 'Get Product Report Detail successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }
  
}

module.exports = StockController
