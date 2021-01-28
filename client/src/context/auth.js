import React, {createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

if (localStorage.getItem('jwtToken')){
    const decodeToken = jwtDecode(localStorage.getItem('jwtToken'));

    if(decodeToken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    } else {
        initialState.user = decodeToken
    }
}

const AuthContext = createContext ({
    user: null,
    login : (userData) => {},
    logout : () => {}
})

function AuthReducer (state, action){
    switch(action.type){

        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    function login(userData){
        localStorage.setItem("jwtToken", userData.token); //this takes the token from login session and stores it on the local device 
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem('jwtToken')
        dispatch({
            type:'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider 
            value={{user: state.user, login, logout}}
            {...props}
            />
    )
}

export {AuthContext, AuthProvider}