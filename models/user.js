const mongoose                = require('mongoose');
const Schema                  = mongoose.Schema;
const validator               = require('validator');
const uniqueValidator         = require('mongoose-unique-validator');
const bcrypt                  = require('bcrypt');
const PostSchema              = require('./post');
const FriendRequestSchema     = require('./friendRequest');
const FriendRequestSentSchema = require('./friendRequestSent');
const FriendSchema            = require('./friend');
const MessageSchema           = require('./message');
const MyCommentsSchema        = require('./myComments');
const LikeSchema              = require('./like');
const myLikesSchema           = require('./myLikes');
const InfoSchema              = require('./info');
const ImageSchema             = require('./image');

const NinjaSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uniqueCaseInsensitive: true,
        minlength: [4, 'Username is too short'],
        maxlength: [16, 'Username is too long'],
        validate: [/^[a-zA-Z0-9_]+$/, 'Username must contain only Characters, Numbers and Underscores']
    },
    password: {
        type: String,
        required: true,
        unique: false,
        minlength: [6, 'Password is too short'],
        maxlength: [100, 'Password is too long'],
        validate: [/^[^ ]+$/ , 'Passwords can contain anything but Spaces']
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        uniqueCaseInsensitive: true,
        validate: [validator.isEmail, "The email you've entered is invalid, Please try again" ]
    },
    info: InfoSchema,
    active: {
        type: Boolean,
        default: true
    },
    suspended: {
        type: Boolean,
        default: false
    },
    lowerCaseUsername: {},
    lowerCaseEmail: {},
    created: {
        type: Date,
        default: Date.now
    },
    friends: [ FriendSchema ],
    friendRequests: [ FriendRequestSchema ],
    friendRequestsSent: [ FriendRequestSentSchema ],
    blockedUsers: [],
    profilePicture: {
        type: String,
        default: '/assets/images/blank_avatar.png'
    }
    ,images: [ ImageSchema ],
    posts: [ PostSchema ],
    messages: [ MessageSchema ],
    myComments: [ MyCommentsSchema ],
    myLikes: [ myLikesSchema ],
    shares: [],
    notifications: [],
    profileViews: {
        type: Number,
        default: 0
    }
});

// Authenticate input against database
NinjaSchema.statics.authenticate = function (email, password, callback) {
    Ninja.findOne({ lowerCaseEmail: email.toLowerCase() })
        .exec((err, user) => {
            if (err) return callback(err)
            if (!user) {
                const err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            } else {
                console.log(email, password, user.password);
                bcrypt.compare(password, user.password, function (err, result) {
                    return result ? callback(null, user) : (console.log('wrong password'), callback());
                });
            }
    });
}

// Hashing the password before saving it to the database
NinjaSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hashedPassword) {
        if (err) {
            next(err);
        } else {
            user.password = hashedPassword;
            next();
        }
    });
});

NinjaSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

const Ninja = mongoose.model('users', NinjaSchema);
module.exports = Ninja;