import { gql } from '@apollo/client'

// Modify this query as the backend api requires
export const VIEWER = gql`
  query Viewer {
    viewer {
      id
    }
  }
`
