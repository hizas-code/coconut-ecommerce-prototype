'use strict'

const ProductCategory = use('App/Models/ProductCategory')
const BasicService = use('App/Services/BasicService')

class ProductCategoryController {

  async store({ request, response }){
    const body = request.only(['name'])
    try {
      const isUnique = await BasicService.checkUniqueData({ modelName: 'ProductCategory', field: 'name', key: body.name })
      if(!isUnique){
        return response.json({ success: false, result: {}, message: 'Product Category with the same name already exists.' })
      }
      const result = await ProductCategory.create({ name: body.name })
      return response.status(200).json({ success: true, result: result, message: 'Create Product Category success.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }    
  }

  async list({ request, response }){
    const params = request.only([ 'page', 'limit', 'search' ])
    try {
      const query = ProductCategory.query().where('deleted_at', null)
      if(params.search) query.whereRaw(`name ilike '%${params.search}%'`)
      const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 5)
      return response.status(200).json({ success: true, result: result, message: 'Get list Product Category successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async update({ request, response }){

  }

  async delete({ request, response }){

  }

}

module.exports = ProductCategoryController
