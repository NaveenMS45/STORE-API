const product = require('../models/product')

const getAllProductsStatic = async(req,res)=>{
    const products = await product.find({}).select('name price');
    res.status(200).json({products,nbHits:products.length});
}

const getAllProducts = async (req, res) => {

    const {featured,company,name,sort,fields,numericFilter} = req.query
    const queryObject = {}
    if(featured){
      queryObject.featured = featured ===`true`?true:false;
    }
    if(company){
      queryObject.company = company;
    }
    if(name){
      queryObject.name = {$regex:name,$options:'i'}
    }

    if(numericFilter){
      const operatorsMap = {
        '<': '$lt',
        '>': '$gt',
        '<=': '$lte',
        '>=': '$gte',
        '=': '$eq',
      }
      const regEX = /\b(<|>|<=|>=|=)\b/g
      let filter = numericFilter.replace(
        regEX,
        (match)=> `_${operatorsMap[match]}_`
      )
    
    const options = ['price','rating'];
    filter = filter.split(',').forEach((item) =>{
      const [field,operator,value] = item.split('_') 
      if(options.includes(field)){
        queryObject[field] = {[operator]:Number(value)}
      }
    })
  }
    console.log(queryObject);
    let result = product.find(queryObject)
    // sort
    if(sort){
      const sortList = sort.split(',').join(' ')
      result = result.sort(sortList);
    }else{
      result = result.sort('createdAt')
    }
    // select
    if(fields){
      const fieldsList = fields.split(',').join(' ')
      result = result.select(fieldsList);
    }  
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit;

    result = result.skip(skip).limit(limit)
    // 23
    // 4 7 7 7 2

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}