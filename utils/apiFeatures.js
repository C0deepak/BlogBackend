class ApiFeature{
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            $or: [
                {heading: {
                    $regex: this.queryStr.keyword,
                    $options: 'i',
                }},
                {tags: {
                    $in: [this.queryStr.keyword]
                }}
            ]
        } : {}

        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy = {...this.queryStr} //so that reference don't pass this will make a new copy
        // console.log(queryCopy)

        const removeFields = ["keyword", "page", "limit"]
        removeFields.forEach(key => delete queryCopy[key])
        // console.log(queryCopy)

        this.query = this.query.find(queryCopy)
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1

        const skip = resultPerPage * (currentPage - 1)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeature