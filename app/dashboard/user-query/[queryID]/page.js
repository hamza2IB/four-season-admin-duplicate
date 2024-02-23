'use client'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_INBOXE_ID } from '@/app/graphql/queries'

function page({ params }) {
	const [dataQuery, setDataQuery] = useState({
		_id: 1,
		name: 'Hamza Ashfaq',
		email: 'hamza2.idenbrid@gmail.com',
		phone: '+1234567890',
		subject: 'Reservation Inquiry',
		message:
			'Hello, I hope this message finds you well. I recently dined at your restaurant and wanted to share some feedback and suggestions with you. Overall, I had a fantastic experience, and I want to commend your staff for their excellent service and the quality of the food. However, I noticed a slight issue with the lighting in the dining area, which could be improved for a more ambient atmosphere. Additionally, it would be great to see more vegetarian options on the menu to cater to a wider range of dietary preferences. Despite these minor suggestions, I thoroughly enjoyed my meal and will definitely be returning in the future. Keep up the great work!',
		created_at: '2024-02-23T12:00:00Z',
	})
	const [loadingQuery, setLoadingQuery] = useState(false)
	const router = useRouter()

	return (
		<>
			<Breadcrumb pageName={dataQuery?.subject} />
			<div className='h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]'>
				<div className='h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex'>
					<div className='flex h-full flex-col border-l border-stroke dark:border-strokedark w-full'>
						<div className='sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark'>
							<div className='flex flex-col' bis_skin_checked='1'>
								<h5 className='font-medium text-black dark:text-black mb-5 flex gap-x-12'>
									<button onClick={() => router.back()}>
										<BackSVG />
									</button>
									{dataQuery?.subject || 'N/A'}
								</h5>
								<div className='flex items-center'>
									<div className='mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full' bis_skin_checked='1'>
										<div className='w-25 h-25'></div>
									</div>
									<div bis_skin_checked='1'>
										<h5 className='font-medium text-black dark:text-black'>{dataQuery?.name}</h5>
										<p className='text-sm'>{dataQuery?.email}</p>
										<p className='text-sm'>{dataQuery?.phone}</p>
									</div>
								</div>
							</div>
						</div>
						<div className='px-6 py-4.5'>
							<p className='dark:text-black mb-5 text-medium'>{dataQuery?.message || 'N/A'}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default page

// SVG'S
const BackSVG = () => {
	return (
		<svg
			className='fill-current'
			width='20'
			height='20'
			viewBox='0 0 20 20'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ transform: 'rotate(-180deg)' }}>
			<path
				d='M18.625 9.28125C18.5 9.0625 18.3125 8.90625 18.0937 8.78125L3.68747 0.718748C3.43747 0.593748 3.15622 0.531248 2.87497 0.562498C2.59372 0.593748 2.34372 0.687498 2.12497 0.874998C1.90622 1.0625 1.74997 1.3125 1.68747 1.5625C1.59372 1.84375 1.62497 2.125 1.71872 2.40625L4.40622 10L1.71872 17.5937C1.62497 17.875 1.62497 18.1562 1.68747 18.4062C1.74997 18.6875 1.90622 18.9062 2.12497 19.0937C2.34372 19.2812 2.59372 19.375 2.87497 19.4062C2.90622 19.4062 2.96872 19.4062 2.99997 19.4062C3.21872 19.4062 3.46872 19.3437 3.68747 19.2187L18.0937 11.1562C18.3125 11.0312 18.5 10.875 18.625 10.6562C18.75 10.4375 18.8125 10.1875 18.8125 9.96875C18.8125 9.75 18.75 9.5 18.625 9.28125ZM3.06247 1.96875L16.125 9.28125H5.65622L3.06247 1.96875ZM3.06247 18.0312L5.68747 10.7187H16.1562L3.06247 18.0312Z'
				fill=''></path>
		</svg>
	)
}
