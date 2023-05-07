const mongoose = require('mongoose')
const User = require('../models/userSchema')

const blogSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Please Enter Some Heading']
    },
    description: {
        type: String,
        required: [true, 'Please Enter Some Description']
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    noOfLikes: {
        type: Number,
        default: 0
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: [true, 'PLease Enter the Category']
    },
    tags: [
        {
            type: String,
            required: [true, 'Please Enter Some tags']
        }
    ],
    noOfComments: {
        type: Number,
        default: 0
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            image: {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdBy: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        noOffollowers: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Blog', blogSchema)