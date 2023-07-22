'use strict'

const { v4: uuidv4 } = require('uuid');

class BasicService {

  static async list({ modelName, params }){
    const query = use('App/Models/'+modelName).query()
    if(!params.search) query.orderBy(sort ? Object.keys(sort)[0] : 'id', sort ? Object.values(sort)[0] : 'desc')
    const result = await query.paginate(params.page ? params.page : 1, params.limit ? params.limit : 10)
    return result
  }

  static async checkUniqueData({ modelName, field, key }){
    const modelPath = 'App/Models/' + modelName
    const model = use(modelPath)
    const isExist = await model.query().where('deleted_at', null).where(field, key).first()
    if(isExist) return false
    else return true
  }

  static async generateCode({ modelName, uniqueColumn }){
    const model = use('App/Models/' + modelName)
    let code
    let codeExist
    do {
      code = uuidv4()
      codeExist = await model.query().where(uniqueColumn, code).first()
    } while(codeExist)
    return code
  }

}

module.exports = BasicService