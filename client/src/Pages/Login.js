import React, {useState, useContext} from 'react'
import {Button, Form} from 'semantic-ui-react'
import {useMutation, gql} from '@apollo/client'

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


    function userLoginCallback(){
        loginUser();
    }
    
    return (
        <div className='form-container'>
           <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1><b>Login</b></h1>
                <Form.Input
                label="Username"
                placeholder="Username.."
                name="username"
                type='text'
                value={values.username}
                error={errors.username ? true : false}
                onChange={onChange}
                />
                <Form.Input
                label="Password"
                placeholder="Password.."
                name="password"
                type='password'
                value={values.password}
                error={errors.password ? true : false}
                onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
           </Form> 
            {Object.keys(errors).length > 0 && (
                 <div className="ui error message">
                 <ul className="list">
                     {Object.values(errors).map(value=>(
                         <li key={value}>{value}</li>
                     ))}
                 </ul>
             </div>
            )}

        </div>
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
