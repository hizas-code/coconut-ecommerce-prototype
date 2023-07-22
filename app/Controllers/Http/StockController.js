'use strict'

const Stock = use('App/Models/Stock')
const BasicService = use('App/Services/BasicService')

class StockController {

  async stockIncrease({ request, response }){
    const body = request.only([ 'product_item_id', 'warehouse_id', 'quantity' ])
    const result = await Stock.create(body)
    return response.status(200).json({ success: true, data: result, message: 'Create stock successful.'})
  }

  async stockReport({ request, response }){
    
  }

  
}

module.exports = StockController
