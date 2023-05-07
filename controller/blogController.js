const Blog = require('../models/blogSchema')
const User = require('../models/userSchema')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const ApiFeature = require('../utils/apiFeatures')

// create Blog
// exports.createBlog = async (req, res, next) => {
//     const blog = await Blog.create(req.body)
//     res.status(201).json({
//         success: true,
//         blog
//     })
// }
exports.createBlog = catchAsyncError(async (req, res, next) => {
    const author = {
        user: req.user._id,
        name: req.user.name,
        image: req.user.avatar,
        noOfFollowers: req.user.noOfFollowers
    }

    const blogData = { ...req.body, createdBy: author }
    const blog = await Blog.create(blogData)

    res.status(201).json({
        success: true,
        blog
    })
})

// get all Blogs
exports.getAllBlogs = catchAsyncError(async (req, res, next) => {

    // return next(new ErrorHandler("This is a temporary error", 500))
    const resultPerPage = 12
    const blogCount = await Blog.countDocuments()

    const apiFeature = new ApiFeature(Blog.find(), req.query).search().filter().pagination(resultPerPage)
    const blogs = await apiFeature.query
    res.status(200).json({
        success: true,
        blogs,
        blogCount
    })
})

// get Blog Details
exports.blogDetail = catchAsyncError(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id)
    if (!blog) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

    res.status(200).json({
        success: true,
        blog,
        blogCount
    })
})

//update Blog
exports.updateBlog = catchAsyncError(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id)
    if (!blog) {
        return next(new ErrorHandler('Product Not Found', 404))
    }
    // console.log(blog.blogCreatedById)
    // console.log(req.user._id.toString())

    if (blog.createdBy.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You Dont have access to update this blog', 401))
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    res.status(200).json({
        success: true,
        blog
    })
})

// delete Blog
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id)
    // console.log(blog)
    // if (!blog) {
    //     return res.status(404).json({
    //         success: false,
    //         message: "Product Not Found"
    //     })
    // }

    if (!blog) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

    if (blog.createdBy.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You Dont have access to delete this blog', 401))
    }

    await blog.deleteOne()
    res.status(200).json({
        success: true,
        message: "Blog deleted Successfully"
    })
})

// create comment or update the comment
exports.createBlogComment = catchAsyncError(async (req, res, next) => {

    const { comment, blogId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        image: req.user.avatar,
        comment: comment
    }

    const blog = await Blog.findById(blogId)

    const isCommented = blog.comments.find(com => com.user.toString() === req.user._id.toString())
    if (isCommented) {
        blog.comments.forEach(com => {
            if (com.user.toString() === req.user._id.toString()) {
                com.comment = comment
            }
        })
    }
    else {
        blog.comments.push(review)
        blog.noOfComments++
    }

    await blog.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })

})

// to get all comment
exports.getBlogComment = catchAsyncError(async (req, res, next) => {
    const blog = await Blog.findById(req.query.blogId)

    if (!blog) {
        return next(new ErrorHandler('Blog Not Found!', 404))
    }

    res.status(200).json({
        success: true,
        comments: blog.comments
    })
})

// delete Review
exports.deleteBlogComment = catchAsyncError(async (req, res, next) => {
    const blog = await Blog.findById(req.query.blogId)

    if (!blog) {
        return next(new ErrorHandler('Blog Not Found!', 404))
    }

    const comments = blog.comments.filter(com => com._id.toString() !== req.query.id.toString())
    const noOfComments = blog.noOfComments - 1
    // console.log(comments)
    await Blog.findByIdAndUpdate(req.query.blogId, { comments }, { noOfComments }, {
        new: true,
        runValidatore: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// create likes or delete likes
exports.createBlogLike = catchAsyncError(async (req, res, next) => {

    const blog = await Blog.findById(req.body.blogId)

    if (!blog) {
        return next(new ErrorHandler('Blog Not Found!', 404))
    }

    const likeObj = {
        user: req.user._id,
        name: req.user.name,
    }

    const isLiked = blog.likes.find(like => like.user.toString() === req.user._id.toString())

    if (isLiked) {
        const updatedLikes = blog.likes.filter(like => like.user.toString() !== req.user._id.toString())
        blog.likes = updatedLikes
        blog.noOfLikes--
    }
    else {
        blog.likes.push(likeObj)
        blog.noOfLikes++
    }

    await blog.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })
})

// blogs of a particular user
exports.blogPerUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.query.userId)
    if (!user) {
        return next(new ErrorHandler('User Not Found!', 404))
    }
    const blogs = await Blog.find({ 'createdBy.user': user._id })

    res.status(200).json({
        success: true,
        blogs
    })
})

// get personal written blogs
exports.personalBlog = catchAsyncError(async (req, res, next) => {
    const blogs = await Blog.find({ 'createdBy.user': req.user._id })
    res.status(200).json({
        success: true,
        blogs
    })
})

// collect blog
exports.collectBlog = catchAsyncError(async (req, res, next) => {
    const isCollected = req.user.blogCollection.includes(req.body.blogId)
    if (isCollected) {
        const updatedCollection = req.user.blogCollection.filter(blog => blog.toString() !== req.body.blogId.toString())
        req.user.blogCollection = updatedCollection
        console.log("already collected")
    }
    else {
        req.user.blogCollection.push(req.body.blogId)
        console.log("new collection")
    }

    await req.user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })
})

exports.myCollection = catchAsyncError(async(req, res, next) => {
    const user = User.findById(req.user._id)
    console.log(user.populate())

    res.status(200).json({
        success: true,
        // collectedBlogs
    })
})


