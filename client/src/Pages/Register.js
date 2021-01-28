import React, {useState, useContext} from 'react'
import {Button, Form} from 'semantic-ui-react'
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

    function registeruser(){
        addUser();
    }

    
    return (
        <div className='form-container'>
           <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1><b>Register Here to start Reaching</b></h1>
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
                label="Email"
                placeholder="Email.."
                name="email"
                type='email'
                value={values.email}
                error={errors.email ? true : false}
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
                <Form.Input
                label="Confirm Password"
                placeholder="Confirm Password.."
                name="confirmpassword"
                type='password'
                value={values.confirmpassword}
                onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
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
