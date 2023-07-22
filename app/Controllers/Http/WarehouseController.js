'use strict'

const DB = use('Database')
const Warehouse = use('App/Models/Warehouse')
const BasicService = use('App/Services/BasicService')

class WarehouseController {

  async store({ request, response }){
    const body = request.only(['name', 'address', 'city', 'description'])
    try {
      const isDataUnique = await BasicService.checkUniqueData({ modelName: 'Warehouse', field: 'name', key: body.name })
      if(!isDataUnique) return response.status(400).json({ success: false, data: {}, message: 'Warehouse with this name already exists.' })
      const result = await Warehouse.create({ name: body.name, address: body.address, city: body.city, description: body.description }) 
      return response.status(500).json({ success: true, data: result, message: 'Create warehouse successful.'})
    } catch (error){
      console.error(error)
      return response.status(500).json({ success: false, data: {}, message: 'Unknown error occured.'})
    }
  }

  async list({ request, response }){
    const params = request.only([ 'page', 'limit', 'search' ])
    const query = Warehouse.query().where('deleted_at', null)
    if(params.search) query.whereRaw(`name ilike '%${params.search}%' or address ilike '%${params.search}%' or city ilike '%${params.search}%'`)
    const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 5)
    return response.json({
      success: true,
      data: result,
      message: 'Get list Warehouse successful.'
    })
  }

  async update({ params, request, response }){
    const body = request.only(['name', 'address', 'city', 'description'])
    const isDataExist = await Warehouse.query().where('id', params.id).where('deleted_at', null).first()
    if(!isDataExist) return response.json({ success: true, data: result, message: 'Data not found.' })
    const result = await Warehouse.query().update(body)
    return response.json({ success: true, data: result, message: 'Update Warehouse successful.' })
  }

  async delete({ params, response }){
    const isDataExist = await Warehouse.findBy('id', params.id)
    if(!isDataExist) return response.json({ success: true, data: result, message: 'Data not found.' })
    const result = await Warehouse.query().update({ deleted_at: new Date() })
    return response.json({ success: true, data: result, message: 'Delete Warehouse successful.' })
  } 

}

module.exports = WarehouseController
