import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
	query Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			user {
				_id
				created_at
				email
				name
				role
			}
			token {
				token
			}
		}
	}
`

export const GET_ALL_INBOXES = gql`
query GetAllContacts {
  getAllContacts {
    _id
    created_at
    email
    message
    name
    phone
    subject
    updated_at
  }
}
`

export const GET_INBOXE_ID = gql`
query GetSingleContact($getSingleContactId: ID!) {
  getSingleContact(id: $getSingleContactId) {
    email
    created_at
    message
    name
    phone
    subject
    updated_at
    _id
  }
}
`

export const GET_ALL_QUOTATION = gql`
query GetAllQuotations {
  getAllQuotations {
    _id
    budget
    email
    engagement_model
    name
    phone
    created_at
  }
}
`

export const GET_SINGLE_QUOTATION = gql`
query GetSingleQuotation($getSingleQuotationId: ID!) {
  getSingleQuotation(id: $getSingleQuotationId) {
    _id
    budget
    created_at
    document
    email
    engagement_model
    name
    phone
    project_description
    service
  }
}
`

export const GET_ALL_CATEGORIES = gql`
query GetAllCategories {
  getAllCategories {
    _id
    name
    created_at
    updated_at
  }
}
`

export const GET_ALL_BLOGS = gql`
query GetAllBlogs {
  getAllBlogs {
    _id
    author {
      name
      _id
    }
    body
    category {
      name
      _id
    }
    created_at
    description
    image
    meta_description
    meta_title
    slug
    title
    updated_at
  }
}

`

export const GET_SINGLE_BLOG = gql`
query GetSingleBlog($getSingleBlogId: ID!) {
  getSingleBlog(id: $getSingleBlogId) {
    _id
    title
    slug
    description
    body
    category {
      name
      _id
    }
    author {
      _id
      name
    }
    image
    meta_title
    meta_description
    created_at
    updated_at
  }
}
`