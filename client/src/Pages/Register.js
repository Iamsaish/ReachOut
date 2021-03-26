import React, {useState, useContext} from 'react'
import {Button, Avatar, CssBaseline, TextField, Paper,  Grid, Typography, makeStyles} from '@material-ui/core'
import {useMutation, gql} from '@apollo/client'

import useForm from '../util/hooks'
import {AuthContext} from '../context/auth'

export default function Register(props) {
    const context = useContext(AuthContext)
    const[errors, setErrors]= useState({});


    const {onChange, onSubmit, values} = useForm(registeruser, {
        username:'',
        password:'',
        confirmpassword:'',
        email:''
    })



    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(_, {data:{register: userData}}){
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

    function registeruser(){
        addUser();
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
              Register 
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
                label="Email"
                placeholder="Email.."
                name="email"
                type='email'
                value={values.email}
                error={errors.email ? true : false}
                onChange={onChange}
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                placeholder="Password.."
                name="password"
                type='password'
                value={values.password}
                error={errors.password ? true : false}
                onChange={onChange}
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                placeholder="Confirm Password.."
                name="confirmpassword"
                type='password'
                value={values.confirmpassword}
                onChange={onChange}
                />
           {Object.keys(errors).length > 0 && (
             <div className="ui error message">
             <ul className="list">
                 {Object.values(errors).map(value=>(
                     <li key={value}>{value}</li>
                 ))}
             </ul>
         </div>
           )}
           <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
        </form>
      </div>
      </Grid>
    </Grid>
    )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmpassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmpassword: $confirmpassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
