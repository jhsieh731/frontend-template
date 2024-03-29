import {
  InMemoryCache, ApolloClient, HttpLink, ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import config from './config'

const httpLink = new HttpLink({
  uri: config.graphqlUrl,
  credentials: 'include',
})

const afterwareLink = new ApolloLink((operation, forward) => forward(operation)
  .map(response => {
    const { response: { headers } } = operation.getContext()
    const token = headers.get('x-token')

    if (token) {
      localStorage.setItem('token', token)
    }

    return response
  }))

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token')
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  }

  return forward(operation)
})

const errorLink = onError(() => {
  // Handle specific errors here
  //   e.g. redirect to login on AuthenticationError
})

export const cache = new InMemoryCache()

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    errorLink,
    afterwareLink,
    middlewareLink,
    httpLink,
  ]),
})

export default client
