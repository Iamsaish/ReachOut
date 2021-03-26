import React, {useContext} from 'react';
import {Card, Icon, Label, Image, Button, Popup} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import moment from 'moment'
import '../App.css'

import {AuthContext} from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

function PostCard ({post: {body, createdAt, id, username, likeCount, commentCount, likes}}){
  const {user} = useContext(AuthContext);

    return(
    
    <Card color='red' fluid>
      <Card.Content className='cardbody'>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra className='extrabg'>
        <LikeButton user={user} post ={{id , likes, likeCount}}/>
            <Popup 
            content='comment on post'
            inverted
            trigger={
              <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button basic color='black'>
                <Icon name='comments' />
            </Button>
            <Label as='a' basic color='black' pointing='left'>
                {commentCount}
            </Label>
        </Button>
            }/>
        {user && user.username === username && (
          <DeleteButton postId={id}/>
        )}
      </Card.Content>
    </Card>
        
    )
}

export default PostCard;