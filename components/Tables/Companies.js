'use client'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { Form, Formik, Field, FieldArray, FormikProps } from 'formik'
import Moment from 'react-moment'
import * as Yup from 'yup'
import crypto from 'crypto'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import ConfirmDeletionModel from '@/components/Model/ConfirmDeletion'
import Loader from '../common/LoaderSM'
import Link from 'next/link'
import { useMutation, useQuery } from '@apollo/client'

import { GET_ALL_BLOGS } from '@/app/graphql/queries'
import { DELETE_BLOG, CREATE_CATEGORY, UPDATE_CATEGORY } from '@/app/graphql/mutations'
import axios from 'axios'

const CategorySchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required*'),
})

const TableThree = () => {
	const { loading: loadingQuery, data: dataQuery, refetch: refetchQuery } = useQuery(GET_ALL_BLOGS)
	const [DeleteBlog, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_BLOG)

	const [isConfirmModelShow, setIsConfirmModelShow] = useState(false)
	const [blogID, setBlogID] = useState(null)
	const [selectedBlogImgUrl, setSelectedBlogImgUrl] = useState(null)

	const generateSHA1 = (data) => {
		const hash = crypto.createHash('sha1')
		hash.update(data)
		return hash.digest('hex')
	}

	const generateSignature = (publicId, apiSecret) => {
		const timestamp = new Date().getTime()
		return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
	}

	const handleBlogDeletion = async () => {
		try {
			const match = selectedBlogImgUrl.match(/\/v\d+\/([^/]+)\.\w{3,4}$/)
			const imagePublicId = match ? match[1] : null
			const signature = generateSHA1(generateSignature(imagePublicId, 'YJubscK9NoxA3pjC9Swe_5WFmZA'))
			if (imagePublicId) {
				await axios.post(`https://api.cloudinary.com/v1_1/dbddpznsv/image/destroy`, {
					public_id: imagePublicId,
					signature: signature,
					api_key: '338599951488193',
					timestamp: new Date().getTime(),
				})
			}
			await DeleteBlog({ variables: { deleteBlogId: blogID } })
			if (!deleteError) {
				toast.success('Blog deleted successfully!')
				setIsConfirmModelShow(false)
				setBlogID(null)
				await refetchQuery()
			}
		} catch (error) {
			console.log(`Delete Blog Submission error! ${error.message}`)
			toast.success('Try Again')
		}
	}

	return (
		<div className='grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3'>
			<SkeletonTheme baseColor='#5294e0' highlightColor='#96c7ff' borderRadius='0.5rem' duration={4}>

				{!loadingQuery &&
					dataQuery?.getAllBlogs?.map((blog, key) => (
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='flex items-center justify-between gap-3 px-6 py-5' bis_skin_checked='1'>
								<div bis_skin_checked='1'>
									<h4 className='font-medium text-black dark:text-black'>{blog?.author?.name}</h4>
									<p className='text-xs font-medium'>{blog?.category?.name}</p>
								</div>
								<div className='flex gap-3'>
									<Link href={`/dashboard/blogs/${blog?._id}/edit`} className='hover:text-primary'>
										<svg
											className='fill-current'
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<g clipPath='url(#clip0_62_9787)'>
												<path
													d='M15.55 2.97499C15.55 2.77499 15.475 2.57499 15.325 2.42499C15.025 2.12499 14.725 1.82499 14.45 1.52499C14.175 1.24999 13.925 0.974987 13.65 0.724987C13.525 0.574987 13.375 0.474986 13.175 0.449986C12.95 0.424986 12.75 0.474986 12.575 0.624987L10.875 2.32499H2.02495C1.17495 2.32499 0.449951 3.02499 0.449951 3.89999V14C0.449951 14.85 1.14995 15.575 2.02495 15.575H12.15C13 15.575 13.725 14.875 13.725 14V5.12499L15.35 3.49999C15.475 3.34999 15.55 3.17499 15.55 2.97499ZM8.19995 8.99999C8.17495 9.02499 8.17495 9.02499 8.14995 9.02499L6.34995 9.62499L6.94995 7.82499C6.94995 7.79999 6.97495 7.79999 6.97495 7.77499L11.475 3.27499L12.725 4.49999L8.19995 8.99999ZM12.575 14C12.575 14.25 12.375 14.45 12.125 14.45H2.02495C1.77495 14.45 1.57495 14.25 1.57495 14V3.87499C1.57495 3.62499 1.77495 3.42499 2.02495 3.42499H9.72495L6.17495 6.99999C6.04995 7.12499 5.92495 7.29999 5.87495 7.49999L4.94995 10.3C4.87495 10.5 4.92495 10.675 5.02495 10.85C5.09995 10.95 5.24995 11.1 5.52495 11.1H5.62495L8.49995 10.15C8.67495 10.1 8.84995 9.97499 8.97495 9.84999L12.575 6.24999V14ZM13.5 3.72499L12.25 2.49999L13.025 1.72499C13.225 1.92499 14.05 2.74999 14.25 2.97499L13.5 3.72499Z'
													fill=''></path>
											</g>
											<defs>
												<clipPath id='clip0_62_9787'>
													<rect width='16' height='16' fill='white'></rect>
												</clipPath>
											</defs>
										</svg>
									</Link>
									<button
										className='hover:text-primary'
										onClick={() => {
											setIsConfirmModelShow(true)
											setSelectedBlogImgUrl(blog?.image)
											setBlogID(blog?._id)
										}}>
										<svg
											className='fill-current'
											width='18'
											height='18'
											viewBox='0 0 18 18'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z'
												fill=''
											/>
											<path
												d='M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z'
												fill=''
											/>
											<path
												d='M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z'
												fill=''
											/>
											<path
												d='M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z'
												fill=''
											/>
										</svg>
									</button>
								</div>
							</div>
							<Link href={`/dashboard/blogs/${blog?._id}/view`} className='block px-4'>
								<img src={blog?.image} alt='Cards' className='w-full h-[200px] object-cover' />
							</Link>
							<div className='p-6' bis_skin_checked='1'>
								<h4 className='mb-3 text-xl font-semibold text-black dark:text-black'>
									<Link href={`/dashboard/blogs/${blog?._id}/view`}>{blog?.title}</Link>
								</h4>
								<p className='font-medium'>{blog?.description}</p>
							</div>
						</div>
					))}

				{loadingQuery &&
					Array.from({ length: 20 })?.map((_, key) => (
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='px-6 py-5' bis_skin_checked='1'>
								<h4 className='font-semibold text-black dark:text-black'>
									<Skeleton />
								</h4>
								<p className='font-medium'>
									<Skeleton />
								</p>
							</div>
							<div className='block px-4 h-[200px]'>
								<Skeleton className='h-[200px] d-block' />
							</div>
							<div className='p-6' bis_skin_checked='1'>
								<h4 className='mb-3 text-xl font-semibold text-black dark:text-black'>
									<Skeleton />
								</h4>
								<p className='font-medium'>
									<Skeleton />
								</p>
							</div>
						</div>
					))}

				{isConfirmModelShow && (
					<ConfirmDeletionModel
						loading={deleteLoading}
						setConfirmModel={setIsConfirmModelShow}
						handleDeleteRequest={handleBlogDeletion}
					/>
				)}
			</SkeletonTheme>
		</div>
	)
}

export default TableThree
