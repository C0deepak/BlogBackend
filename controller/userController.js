const User = require('../models/userSchema')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const sendToken = require('../utils/jwtToken')

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password, followers} = req.body

    const user = await User.create({
        name, email, password, followers,
        avatar: {
            public_id: "This is sample id",
            url: "profilePhoto"
        }
    })

    sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async(req, res, next) => {
    const{email, password} = req.body

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res)
})

exports.logoutUser = catchAsyncError( async(req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out successfully"
    })
})

exports.detailUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

exports.followUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.body.userId)

    if(!user){
        return next(new ErrorHandler('Blog Not Found!', 404))
    }

    const isFollowed = user.followers.find(follower => follower.user.toString() === req.user._id.toString())

    if(isFollowed){
        const updatedFollowers = user.followers.filter(follower => follower.user.toString() !== req.user._id.toString())
        user.followers = updatedFollowers
        user.noOffollowers--
        
        const updatedFollowing = req.user.following.filter(fol => fol.user.toString() !== user._id.toString())
        req.user.following = updatedFollowing
    }
    else{
        user.followers.push({user: req.user._id, name: req.user.name})
        user.noOffollowers++
        req.user.following.push({user: user._id, name: user.name})
    }

    // console.log(user.followers.length)
    // console.log(req.user.following.length)

    await user.save({validateBeforeSave : false})
    await req.user.save({validateBeforeSave : false})

    res.status(200).json({
        success: true,
    })
})