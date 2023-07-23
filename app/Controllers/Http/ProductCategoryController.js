'use strict'

const Product = use('App/Models/Product')
const ProductCategory = use('App/Models/ProductCategory')
const BasicService = use('App/Services/BasicService')

class ProductCategoryController {

  async store({ request, response }){
    const body = request.only(['name'])
    try {
      const isUnique = await BasicService.checkUniqueData({ modelName: 'ProductCategory', field: 'name', key: body.name })
      if(!isUnique){
        return response.status(400).json({ success: false, result: {}, message: 'Product Category with the same name already exists.' })
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

  async update({ params, request, response }){
    const body = request.only(['name'])
    try {
      const isExist = await ProductCategory.query().where('deleted_at', null).where('id', params.id).first()
      if(!isExist) {
        return response.status(400).json({ success: false, result: {}, message: 'Product Category not found.' })
      }
      const isUnique = await BasicService.checkUniqueData({ modelName: 'ProductCategory', field: 'name', key: body.name, id: params.id })
      if(!isUnique){
        return response.status(400).json({ success: false, result: {}, message: 'Product Category with the same name already exists.' })
      }
      await ProductCategory.query().where('deleted_at', null).where('id', params.id).update({ name: body.name })
      const result = await ProductCategory.query().where('deleted_at', null).where('id', params.id).first()
      return response.status(200).json({ success: true, result: result, message: 'Update Product Category successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async delete({ params, response }){
    try {
      const isExist = await ProductCategory.query().where('deleted_at', null).where('id', params.id).first()
      if(!isExist) {
        return response.status(400).json({ success: false, result: {}, message: 'Product Category not found.' })
      }
      const isUsed = await Product.query().where('product_category_id', params.id).where('deleted_at', null).first()
      if(isUsed) {
        return response.status(400).json({ success: false, result: {}, message: 'Product Category is still used by Product.' })
      }
      await ProductCategory.query().where('deleted_at', null).where('id', params.id).update({ deleted_at: new Date() })
      const result = await ProductCategory.query().where('id', params.id).first()
      return response.status(200).json({ success: true, result: result, message: 'Delete Product Category successful.' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

}

module.exports = ProductCategoryController
