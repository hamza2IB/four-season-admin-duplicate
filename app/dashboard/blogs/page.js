'use client'
import { useMutation, useQuery } from '@apollo/client'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Companies from '@/components/Tables/Companies'
import Link from 'next/link'

import { GET_ALL_BLOGS } from '@/app/graphql/queries'

const TablesPage = () => {
	const { loading: loadingQuery, data: dataQuery, refetch: refetchQuery } = useQuery(GET_ALL_BLOGS)

	return (
		<>
			<Breadcrumb pageName='Blogs' />
			<div className='flex justify-end mb-5'>
				<Link
					href='/dashboard/blogs/create'
					className='flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-black hover:bg-opacity-80'>
					<svg
						className='fill-current'
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z'
							fill=''></path>
					</svg>
					Add Blog
				</Link>
			</div>
				<Companies />
		</>
	)
}

export default TablesPage
