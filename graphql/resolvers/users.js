const {SECRET_KEY} = require('../../config');
const User = require('../../models/User');
const {validateRegisterInput, validateLogin} = require ('../../util/validators');

const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const {UserInputError} = require ('apollo-server');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email:user.email,
        username: user.username
    }, SECRET_KEY,{expiresIn: '1h'});
} 

module.exports = {
    Mutation: {
        // resolvers (parent, args, context, info) 
        async login(_, {username, password}){
            const {errors, valid} = validateLogin ( username, password);

            if (!valid){
                throw new UserInputError ('Error', {errors});
            }

            const user = await User.findOne({username});
            if(!user){
                errors.general= 'User not found';
                throw new UserInputError ('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match){
                errors.general='Wrong Credentials';
                throw new UserInputError('Wrong Credentials', {errors});
            }

            const token= generateToken (user);

            return {
                ...user._doc, //where the document is stored
                id: user._id,
                token 
            }
        },
        async register(_,{
            registerInput: {username, email, password, confirmpassword}
        }  
        ){
            //validate user data 
            const {valid, errors}= validateRegisterInput (username, email, password, confirmpassword);
            if (!valid){
                throw new UserInputError('Errors', {errors})
            }
            // Make sure user doesnt already exist 
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError ('Username is taken', {
                    errors:{
                        username: 'Username is already taken'
                    }
                })
            }

            const mail = await User.findOne({email});
            if(mail){
                throw new UserInputError ('Email is already taken', {
                    errors: {
                        email: 'Email is taken'
                    }
                })
            }
            //Hash password and create an auth token
            password = await bcrypt.hash(password,12) //encrypts the password

            const newUser= new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token =generateToken (res);

            return {
                ...res._doc, //where the document is stored
                id: res._id,
                token 
            }

        }
    }
}