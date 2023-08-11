'use strict'

const Order = use('App/Models/Order')
const BasicService = use('App/Services/BasicService')

class OrderController {

  async create({ auth, request, response }){
    const body = request.only([ 'product_item_id', 'amount' ])
    try {
      const orderData = {
        customer_id: auth.user.id,
        product_item_id: body.product_item_id,
        amount: body.amount,
        order_date: new Date(),
        order_status: 'on_process' // on_process, on_delivery, completed
      }
      const result = await Order.create(orderData)
      return response.status(200).json({ success: true, data: result, message: 'Order created successfully.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

  async confirm({ request, response }){
    const body = request.only([ 'order_id', 'warehouse_id' ])
    try {
      await Order.query().where('id', body.order_id).update({ warehouse_id: body.warehouse_id, order_status: 'on_delivery' })
      const result = await Order.query().where('id', body.order_id).first()
      return response.status(200).json({ success: true, data: result, message: 'Order updated successfully.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

  async finish({ request, response }){
    const body = request.only([ 'order_id' ])
    try {
      await Order.query().where('id', body.order_id).update({ order_status: 'completed' })
      const result = await Order.query().where('id', body.order_id).first()
      return response.status(200).json({ success: true, data: result, message: 'Order updated successfully.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

}

module.exports = OrderController
