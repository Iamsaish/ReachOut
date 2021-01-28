import React, {useContext, useState, useRef} from 'react'
import {gql, useQuery, useMutation} from '@apollo/client'
import { Card, Grid, Label , Image, Icon, Button, Form, Popup} from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../Components/LikeButton';
import {AuthContext} from '../context/auth'
import DeleteButton from '../Components/DeleteButton';

export default function SinglePost(props) {

    const postId= props.match.params.postId; //to get post id as props to open on this page
    const {user} = useContext(AuthContext);
    const commentInputRef= useRef(null); //to rollback the comment form to blurred state
    
    const [comment, setComment]=useState('');

    const {data : {getPost}= {} }= useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    }) 

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback(){
        props.history.push('/');
    }

    let postMarkup;
    if(!getPost){
        postMarkup= <p>Loading Post....</p>
    } else {
        const {id, username, body, createdAt, comments, likes, likeCount, commentCount} = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                        size="small"
                        float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>
                                    {username}
                                </Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow}
                                </Card.Meta>
                                <Card.Description>
                                    {body}
                                </Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Popup
                                content='comment on post'
                                trigger={
                                <Button 
                                as="div"
                                labelPosition="right"
                                onClick={()=> console.log('Comment on post')}                                 
                                >
                                    <Button basic color="black">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="black" pointing='left'>
                                        {commentCount}
                                    </Label>
                                </Button>
                                }/>
                                
                                {user && user.username === username &&(
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && <Card fluid>
                            <Card.Content>
                            <p>Post a Comment</p>
                            <Form>
                                <div className='ui action input fluid'>
                                    <input
                                     type='text'
                                     placeholder='Enter comment'
                                     name='comment'
                                     value={comment}
                                     onChange={event => setComment(event.target.value)}
                                     ref={commentInputRef}   
                                    />
                                    <button type="submit"
                                    className='ui button blue'
                                    disabled={comment.trim()=== ''}
                                    onClick={submitComment}>
                                        Post
                                    </button>
                                </div>
                            </Form>
                            </Card.Content>
                            </Card>}
                        {comments.map((comment) =>(
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.created).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId:$postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id
            body
            createdAt
            username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`
