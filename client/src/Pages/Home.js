import React, {useContext} from 'react'
import {useQuery} from '@apollo/client';
import {Grid, GridColumn, Transition} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {AuthContext} from '../context/auth'
import PostCard from '../Components/PostCard';
import PostForm from '../Components/PostForm'
import FETCH_POSTS_QUERY from '../util/graphql'

export default function Home() {
    const {user} = useContext(AuthContext)
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);

    return (
        <Container>
    <Grid columns={3} >
        <Grid.Row className='page-title'>
            <h1>Recent</h1>
        </Grid.Row>
        <Grid.Row>
            {user && (
                <GridColumn>
                    <PostForm/>
                </GridColumn>
            )}
            {loading ? (
                <h1>Loading Posts....</h1>
            ) : (
                <Transition.Group>
                    {
                        posts && posts.map(post => (
                            <Grid.Column key={post.id} style= {{marginBottom: 20}}>
                                <PostCard post={post}/>
                            </Grid.Column>
                        ))
                    }
                </Transition.Group>
            )}
        </Grid.Row>
    </Grid>
    </Container>
    );
}


