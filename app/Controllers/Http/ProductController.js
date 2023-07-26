'use strict'

const DB = use('Database')
const Product = use('App/Models/Product')
const ProductItem = use('App/Models/ProductItem')
const ProductItemDetail = use('App/Models/ProductItemDetail')
const ProductCategory = use('App/Models/ProductCategory')
const BasicService = use('App/Services/BasicService')

class ProductController {

  async store({request , response}){
    const body = request.only(['products'])
    const newProducts = []
    const newProductItems = []
    const newProductItemDetails = []
    try {
      for(const product of body.products){
        const productCode = await BasicService.generateCode({ modelName: 'Product', uniqueColumn: 'code'})
        const isProductCategoryExists = await ProductCategory.query().where('deleted_at', null).where('id', product.category_id).first()
        if(!isProductCategoryExists) {
          return response.status(400).json({ false: true, result: {}, message: 'Invalid Product Category ID.' })
        }
        const productData = { name: product.name, code: productCode,  product_category_id: product.category_id, description: product.description }
        newProducts.push(productData)
        for(const productItem of product.items){
          const productItemCode = await BasicService.generateCode({ modelName: 'ProductItem', uniqueColumn: 'code'})
          const productItemData = { code: productItemCode, product_code: productCode, price: productItem.price }
          newProductItems.push(productItemData)
          for(const productItemDetail of productItem.details){
            const productItemDetailData = { product_item_code: productItemCode, item_detail: productItemDetail.detail, item_detail_name: productItemDetail.name }
            newProductItemDetails.push(productItemDetailData)
          }
        }
      }
    } catch(error){
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }

    const trx = await DB.beginTransaction()
    try {
      const result = await Product.createMany(newProducts, trx)
      await ProductItem.createMany(newProductItems, trx)
      await ProductItemDetail.createMany(newProductItemDetails, trx)
      await trx.commit()
      return response.status(200).json({ success: true, result: result, message: 'Create Product successful.' })
    } catch(error){
      console.error(error)
      await trx.rollback()
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async list({ request, response }){
    const params = request.only([ 'page', 'limit', 'search' ])
    try {
      const query = Product.query().where('deleted_at', null)
      if(params.search) query.whereRaw(`name ilike '%${params.search}%'`)
      const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 5)
      return response.status(200).json({ success: true, result: result, message: 'Get list Product Category successful.' })
    } catch(error){
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

  async show({ params, response }){
    const result = await Product.query()
      .with('productItems', builder => builder.with('productItemDetails')  )
      .where('deleted_at', null)
      .where('id', params.id)
      .first()
    return response.status(200).json({
      success: true,
      result: result,
      message: 'Get list Product Category successful.'
    })
  }

  async update({ params, request, response }){
    const body = request.only(['name', 'description', 'category_id', 'items' ])
    let productCode
    let productItemCodes = []
    const newProductData = { name: body.name , description: body.description, product_category_id: body.category_id }
    const newProductItems = []
    const newProductItemDetails = []
    try {
      const product =  await Product.query().where('deleted_at', null).where('id', params.id).first()
      if(!product) return response.status(400).json({ success: false, result: {}, message: 'Product does not exists.'})
      productCode = product.code
      if(body.items.length == 0) return response.status(500).json({ success: false, result: {}, message: 'Product must have at least 1 item.'})
      for(const productItem of body.items){
        const productItemCode = await BasicService.generateCode({ modelName: 'ProductItem', uniqueColumn: 'code'})
        productItemCodes.push(productItemCode)
        newProductItems.push({ code: productItemCode, product_code: product.code, price: productItem.price })
        for(const productItemDetail of productItem.details){
          const productItemDetailData = { product_item_code: productItemCode, item_detail: productItemDetail.detail, item_detail_name: productItemDetail.name }
          newProductItemDetails.push(productItemDetailData)
        }
      }
    } catch(error){
      console.error(error)
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
    const oldProductItems = await ProductItem.query().where('deleted_at', null)
    const trx = await DB.beginTransaction()
    try {
      await Product.query().where('id', params.id).update(newProductData).transacting(trx)
      if(newProductItems > 0) await ProductItem.query().where(product_code, productCode).update({ deleted_at: null }).transacting(trx)
      await ProductItem.createMany(newProductItems, trx)
      if(newProductItemDetails > 0) await ProductItemDetail.query().whereIn('product_item_code', ).update({ deleted_at: null }).transacting(trx)
      await ProductItemDetail.createMany(newProductItemDetails, trx)
      await trx.commit()
      const result = await Product.query().where('id', params.id).first()
      return response.status(200).json({ success: true, result: result, message: 'Update Product successful.' })
    } catch(error){
      console.error(error)
      await trx.rollback()  
      return response.status(500).json({ success: false, result: {}, message: 'Unknown error occured.'})
    }
  }

}

module.exports = ProductController
