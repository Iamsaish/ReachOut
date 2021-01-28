const Post = require('../../models/Post');
const checkAuth = require ('../../util/check-auth');
const {AuthenticationError, UserInputError, PubSub}= require ('apollo-server');


module.exports = {
    Query:{
        async getPosts(){
            try{
                const posts = await Post.find().sort({createdAt: -1});
                return posts;
            }catch(err){
                throw new Error(err);
            }
        },
        async getPost(_,{postId}){
            try{
                const post = await Post.findById(postId);
                // We use this to check if the post still exists in the DB and has not been deleted
                if(post){ 
                    return post;
                } else {
                    throw new Error ('Post not found');
                }
            } catch(err) {
                throw new Error (err);
            }
        }
    },
    Mutation: {
        async createPost (_, {body}, context){
            const user = checkAuth(context);
            console.log(user);

            if(body.trim()===''){
                throw new Error('post body must not be empty')
            }
            //creating a new post if user auth successful
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            
            //saving the post 
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST',{
                newPost: post
            })

            return post;
        },

        async deletePost (_,{postId},context){
            const user= checkAuth(context);

            //determine if the authorized user is deleting the post 
            
            try{
                const post = await Post.findById(postId);
                if(user.username===post.username){
                    await post.delete();
                    return 'post deleted successfully';
                }else{
                    throw new AuthenticationError ('Action not allowed');
                }
            }catch (err){
                throw new Error(err);
            }
        },
        async likePost (_,{postId},context){
            const {username} = checkAuth (context);

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    //post already liked, unlike it
                    post.likes = post.likes.filter(like=> like.username !== username);
                }else {
                    //Not liked post, like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
    
                await post.save();
                return post;
            }else throw new UserInputError('post not found')
            
        }

    },
    Subscription: {
        newPost : {
            subscribe: (_, __,{pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
};