import React from 'react'
import {Form, Button} from 'semantic-ui-react'
import useForm from '../util/hooks'
import {gql, useMutation} from '@apollo/client'
import FETCH_POSTS_QUERY from '../util/graphql'

export default function PostForm() {

    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body : ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
          const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY,
          });
    
          let newData = [...data.getPosts];
          newData = [result.data.createPost, ...newData];
          proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
              ...data,
              getPosts: {
                newData,
              },
            },
          });
          values.body = ''; //to reset the new post 
        },
      });
    function createPostCallback(){
        createPost();
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create Post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Reach Out"
                    name="body"
                    onChange={onChange}
                    values={values.body}
                    error={error ? true : false}
                    />
                <Button type="Submit" color="black">
                    Post
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom : 20}}>
                <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

const CREATE_POST_MUTATION = gql `
    mutation createPost($body: String!){
        createPost(body: $body){
            id username body createdAt
            likes{
                username id createdAt
            }
            likeCount
            comments{
                id username body createdAt
            }
            commentCount
        }
    }
`
