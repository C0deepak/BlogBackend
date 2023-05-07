const express = require('express')
const { getAllBlogs, createBlog, updateBlog, deleteBlog, blogDetail, createBlogComment, createBlogLike, getBlogComment, deleteBlogComment, blogPerUser, personalBlog, collectBlog, myCollection } = require('../controller/blogController')
const { isAuthenticatedUser } = require('../middleware/auth')
const router = express.Router()

router.route('/blog').get(getAllBlogs)
router.route('/blog/me').get(isAuthenticatedUser, personalBlog)
router.route('/blog/user').get(blogPerUser)
router.route('/blog/collect').get(isAuthenticatedUser, collectBlog)
router.route('/blog/mycollection').get(isAuthenticatedUser, myCollection)
router.route('/blog/create').post(isAuthenticatedUser, createBlog)
router.route('/blog/:id').put(isAuthenticatedUser, updateBlog).delete(isAuthenticatedUser, deleteBlog).get(blogDetail)
router.route('/review/create').put(isAuthenticatedUser, createBlogComment)
router.route('/review').get(getBlogComment).delete(isAuthenticatedUser, deleteBlogComment)
router.route('/like').put(isAuthenticatedUser, createBlogLike)

module.exports = router