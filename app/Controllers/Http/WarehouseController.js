'use strict'

const Stock = use('App/Models/Stock')
const Warehouse = use('App/Models/Warehouse')
const BasicService = use('App/Services/BasicService')

class WarehouseController {

  async store({ request, response }){
    const body = request.only(['name', 'address', 'city', 'description'])
    try {
      const isDataUnique = await BasicService.checkUniqueData({ modelName: 'Warehouse', field: 'name', key: body.name })
      if(!isDataUnique) {
        return response.status(400).json({ success: false, result: {}, message: 'Warehouse with this name already exists.' })
      }
      const result = await Warehouse.create({ name: body.name, address: body.address, city: body.city, description: body.description }) 
      return response.status(200).json({ success: true, result: result, message: 'Create warehouse successful.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async list({ request, response }){
    try {
      const params = request.only([ 'page', 'limit', 'search' ])
      const query = Warehouse.query().where('deleted_at', null)
      if(params.search) query.whereRaw(`name ilike '%${params.search}%' or address ilike '%${params.search}%' or city ilike '%${params.search}%'`)
      const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 5)
      return response.status(200).json({ success: true, result: result, message: 'Get list Warehouse successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async update({ params, request, response }){
    const body = request.only(['name', 'address', 'city', 'description'])
    try {
      const isExist = await Warehouse.query().where('deleted_at', null).where('id', params.id).first()
      if(!isExist) {
        return response.status(400).json({ success: false, result: {}, message: 'Warehouse not found.' })
      }
      const isUnique = await BasicService.checkUniqueData({ modelName: 'Warehouse', field: 'name', key: body.name, id: params.id })
      if(!isUnique){
        return response.status(400).json({ success: false, result: {}, message: 'Warehouse with the same name already exists.' })
      }
      await Warehouse.query().where('deleted_at', null).where('id', params.id).update({ name: body.name })
      const result = await Warehouse.query().where('deleted_at', null).where('id', params.id).first()
      return response.status(200).json({ success: true, result: result, message: 'Update Warehouse successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async delete({ params, response }){
    try {
      const isExist = await Warehouse.query().where('deleted_at', null).where('id', params.id).first()
      if(!isExist) {
        return response.status(400).json({ success: false, result: {}, message: 'Warehouse not found.' })
      }
      const isUsed = await Stock.query().where('warehouse_id', params.id).where('deleted_at', null).first()
      if(isUsed) {
        return response.status(400).json({ success: false, result: {}, message: 'Warehouse is still used by Stock.' })
      }
      await Warehouse.query().where('deleted_at', null).where('id', params.id).update({ deleted_at: new Date() })
      const result = await Warehouse.query().where('id', params.id).first()
      return response.status(200).json({ success: true, result: result, message: 'Delete Warehouse successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

}

module.exports = WarehouseController
