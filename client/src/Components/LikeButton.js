import React, {useState, useEffect} from 'react';
import {useMutation, gql} from '@apollo/client';
import {Link} from 'react-router-dom';
import {Button, Icon, Label, Popup} from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="black">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="black" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="black" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
      <Popup 
      content={liked? 'Unlike' : 'Like'}
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      <Label basic color="black" pointing="left">
        {likeCount}
      </Label>
    </Button>
      }/>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;