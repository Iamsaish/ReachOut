import {gql} from '@apollo/client'
const FETCH_POSTS_QUERY = gql `
    {
        getPosts{
            id
            body
            username
            createdAt
            likeCount
            commentCount
            likes{
                username
                createdAt
            }
            comments{
                username 
                body
                createdAt
            }
            commentCount

        }
    }
`
export default FETCH_POSTS_QUERY;