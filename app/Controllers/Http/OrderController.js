'use strict'

const Order = use('App/Models/Order')
const BasicService = use('App/Services/BasicService')

class OrderController {

  async makeOrders({ auth, request, response }){
    try {
      const body = request.only([ 'product_item_id', 'amount' ])
      const orderData = {
        product_item_id: body.product_item_id,
        amount: body.item,
        order_date: new Date(),
        status: 'on_process', // on_process, delivered, cancelled
      }
      const result = await Order.create(orderData)
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

  async finishOrder({ auth, request, response }){
    const body = request.only([ 'order_id' ])
    try {
      const result =  await Order.query().where('deleted_at', null).update({ status: 'delivered' })
      return response.status(200).json({ success: true, data: result, message: 'Order finished successfully.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

}

module.exports = OrderController
