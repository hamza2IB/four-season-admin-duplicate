import { gql } from '@apollo/client'

export const SIGN_UP_USER = gql`
	mutation SignUpUser($name: String!, $email: String!, $password: String!) {
		signUpUser(name: $name, email: $email, password: $password) {
			token
			user {
				id
				username
				email
			}
		}
	}
`

export const FORGOT_PASSWORD = gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			token
		}
	}
`

export const RESET_PASSWORD = gql`
	mutation ResetPassword($email: String!, $password: String!, $resetToken: String!) {
		resetPassword(email: $email, password: $password, resetToken: $resetToken) {
			success
		}
	}
`

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($name: String) {
		createCategory(name: $name) {
			_id
			created_at
			name
			updated_at
		}
	}
`

export const CREATE_BLOG = gql`
	mutation CreateBlog(
		$title: String!
		$description: String!
		$body: String!
		$slug: String!
		$image: String!
		$category: String
		$metaTitle: String
		$metaDescription: String
	) {
		createBlog(
			title: $title
			description: $description
			body: $body
			slug: $slug
			image: $image
			category: $category
			meta_title: $metaTitle
			meta_description: $metaDescription
		) {
			_id
			created_at
		}
	}
`

export const UPDATE_BLOG = gql`
	mutation UpdateBlog(
		$updateBlogId: ID
		$title: String
		$slug: String
		$description: String
		$body: String
		$category: String
		$image: String
		$author: String
		$status: String
		$metaTitle: String
		$metaDescription: String
	) {
		updateBlog(
			id: $updateBlogId
			title: $title
			slug: $slug
			description: $description
			body: $body
			category: $category
			image: $image
			author: $author
			status: $status
			meta_title: $metaTitle
			meta_description: $metaDescription
		) {
			_id
			updated_at
		}
	}
`

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($updateCategoryId: ID!, $name: String) {
		updateCategory(id: $updateCategoryId, name: $name) {
			_id
			created_at
		}
	}
`

export const DELETE_CONTACT = gql`
	mutation DeleteContact($deleteContactId: ID!) {
		deleteContact(id: $deleteContactId) {
			_id
			updated_at
		}
	}
`

export const DELETE_QUOTATION = gql`
	mutation DeleteQuotation($deleteQuotationId: ID!) {
		deleteQuotation(id: $deleteQuotationId) {
			_id
			updated_at
		}
	}
`

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($deleteCategoryId: ID!) {
		deleteCategory(id: $deleteCategoryId) {
			_id
			updated_at
		}
	}
`

export const DELETE_BLOG = gql`
	mutation DeleteBlog($deleteBlogId: ID!) {
		deleteBlog(id: $deleteBlogId) {
			_id
			created_at
		}
	}
`
