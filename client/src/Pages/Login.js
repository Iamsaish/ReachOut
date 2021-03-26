import React, {useState, useContext} from 'react'
import {useMutation, gql} from '@apollo/client'
import {Button, Avatar, CssBaseline, TextField, Link, Paper, Box, Grid, Typography, makeStyles} from '@material-ui/core'


import useForm from '../util/hooks'
import {AuthContext} from '../context/auth'

export default function Register(props) {
    const context = useContext(AuthContext)
    const[errors, setErrors]= useState({});
   
    const {onChange, onSubmit, values} = useForm(userLoginCallback, {
        username:'',
        password:''
    });
   

    const [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}){
            context.login(userData) 
            props.history.push('/'); //redirect to homepage
        },

        onError(err){
           
            setErrors(err.graphQLErrors[0].extensions.exception.errors); //get errors (serverside validation)
        },
        variables: values 
    })

    const useStyles = makeStyles((theme) => ({
        root: {
          height: '70vh',
        },
        image: {
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        paper: {
          margin: theme.spacing(8, 4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '80%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
      }));

      const classes = useStyles();


    function userLoginCallback(){
        loginUser();
    }
    
    return (
      
           
        <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              autoFocus
              type='text'
              value={values.username}
              error={errors.username ? true : false}
              onChange={onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={values.password}
              error={errors.password ? true : false}
              onChange={onChange}
            />
             <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            {Object.keys(errors).length > 0 && (
                 <div className="ui error message">
                 <ul className="list">
                     {Object.values(errors).map(value=>(
                         <li key={value}>{value}</li>
                     ))}
                 </ul>
             </div>
            )}
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
    )
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
