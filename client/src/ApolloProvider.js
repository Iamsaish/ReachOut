import React from 'react';
import App from './App';
import {ApolloClient, InMemoryCache, createHttpLink, ApolloProvider} from '@apollo/client';
import {setContext} from 'apollo-link-context'

const httpLink = createHttpLink({
    uri:'http://localhost:5000/'
})

// To get authorization token while creating a post 
const authLink = setContext(()=>{
    const token =localStorage.getItem('jwtToken');
    return{
        headers:{
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
                getPosts:{
                    likes:{
                        merge(existing, incoming, { mergeObjects }) {
                            // Correct, thanks to invoking nested merge functions.
                            return mergeObjects(existing, incoming);
                        }
                    }
                }
            
        }
    })
})

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)