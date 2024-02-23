'use client'
import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from '@/js/axios'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Loader from '@/components/common/LoaderSM'
import Image from 'next/image'
import ConfirmDeletionModel from '@/components/Model/ConfirmDeletion'
import Profile from '@/app/dashboard/profile/page'

const FormLayout = ({ params }) => {
	const [loading, setLoading] = useState(true)
	const [isConfirmModelShow, setIsConfirmModelShow] = useState(false)
	const [reviewID, setReviewID] = useState(null)
	const [replyID, setIsReply] = useState(null)
	const [companyDetail, setCompanyDetail] = useState({})
	const [replyMsg, setReplyMsg] = useState('')

	const getCompanyDetail = async () => {
		try {
			const { data } = await axios.get(`/company/${params.companyID}/admin`)
			setCompanyDetail(data)
			setLoading(false)
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	const handlePostReply = async () => {
		if (!replyMsg) {
			return null
		}
		try {
			setLoading(true)
			const { data } = await axios.post(`/company/${params.companyID}/reviews/${reviewID}/reply`, {
				replyMessage: replyMsg,
				reviewID: reviewID,
			})
			getCompanyDetail()
			setIsReply(false)
			setLoading(false)
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	const handleReviewDeletion = async () => {
		try {
			setLoading(true)
			const { data } = await axios.delete(`/company/${params.companyID}/reviews/${reviewID}`)
			getCompanyDetail()
			setIsConfirmModelShow(false)
			setLoading(false)
			toast.success('Review deleted successfully!')
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	useEffect(() => {
		getCompanyDetail()
	}, [])

	return (
		<>
			<Profile companyDetail={companyDetail} />

			<div className='mt-10 mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<h2 className='text-title-md2 font-semibold text-black dark:text-black'>User Reviews</h2>
			</div>
			<div className='grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3'>
				{companyDetail?.reviews?.map((review, index) => {
					return (
						<div
							className={`rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark `}
							bis_skin_checked='1'
							key={index}>
							{review?.isDeleted && (
								<span
									className='flex items-center justify-center gap-1 bg-red p-1 text-xs font-medium text-black'
									style={{ background: '#fb5454' }}>
									<svg width='14' height='15' viewBox='0 0 14 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M13.0157 5.24683C12.7532 5.24683 12.5344 5.46558 12.5344 5.72808V8.1562L9.40631 6.07808C8.94693 5.77183 8.37818 5.77183 7.91881 6.07808L5.0313 8.00308C4.92193 8.09058 4.7688 8.09058 4.63755 8.00308L1.24693 5.74995C1.02818 5.59683 0.721929 5.66245 0.568804 5.8812C0.415679 6.09995 0.481304 6.4062 0.700054 6.55933L4.09068 8.81245C4.55005 9.1187 5.1188 9.1187 5.57818 8.81245L8.46568 6.88745C8.57506 6.79995 8.72818 6.79995 8.85943 6.88745L11.6594 8.7687H9.4938C9.23131 8.7687 9.01256 8.98745 9.01256 9.24995C9.01256 9.51245 9.23131 9.7312 9.4938 9.7312H13.0157C13.2782 9.7312 13.4969 9.51245 13.4969 9.24995V5.72808C13.5188 5.46558 13.2782 5.24683 13.0157 5.24683Z'
											fill='white'></path>
									</svg>
									<span>Deleted</span>
								</span>
							)}
							<div className='flex items-center gap-3 py-5 px-6' bis_skin_checked='1'>
								<div className='h-10 w-10 rounded-full flex items-center' bis_skin_checked='1'>
									<img alt='User' loading='lazy' src={review?.userPhoto} />
								</div>
								<div className='flex justify-between items-center w-full'>
									<div bis_skin_checked='1'>
										<h4 className='font-medium text-black dark:text-black'>{review?.reviewerName}</h4>
										<p className='text-sm rating flex'>
											{Array.from({ length: 5 }, (_, i) => (
												<span key={i} className={`icon_star ${i >= Math.ceil(review?.rating) ? 'empty' : ''}`}>
													<svg xmlns='http://www.w3.org/2000/svg' height='15' width='15' viewBox='0 0 576 512'>
														<path d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z' />
													</svg>
												</span>
											))}
										</p>
									</div>
									<div>
										<button
											className='mr-3'
											onClick={() => {
												setReviewID(review?._id)
												setIsReply(true)
											}}>
											<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'>
												<path
													fill='currentColor'
													d='M19 19v-4q0-1.25-.875-2.125T16 12H6.825l3.6 3.6L9 17l-6-6l6-6l1.425 1.4l-3.6 3.6H16q2.075 0 3.538 1.463T21 15v4z'
												/>
											</svg>
										</button>
										{review?.isDeleted ? (
											<button
												onClick={() => {
													setIsConfirmModelShow(true)
													setReviewID(review?._id)
												}}>
												<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'>
													<path
														fill='currentColor'
														d='M8.06.56A8.05 8.05 0 0 0 1.24 4.2V1.55H0V5a1.16 1.16 0 0 0 1.15 1.14h3.44V4.9H2.27a6.79 6.79 0 0 1 5.79-3.1a6.48 6.48 0 0 1 6.7 6.2a6.48 6.48 0 0 1-6.7 6.2A6.48 6.48 0 0 1 1.36 8H.12a7.71 7.71 0 0 0 7.94 7.44A7.71 7.71 0 0 0 16 8A7.71 7.71 0 0 0 8.06.56'
													/>
												</svg>
											</button>
										) : (
											<button
												onClick={() => {
													setIsConfirmModelShow(true)
													setReviewID(review?._id)
												}}>
												<svg
													className='fill-current'
													width='22'
													height='22'
													viewBox='0 0 22 22'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M16.8094 3.02498H14.1625V2.4406C14.1625 1.40935 13.3375 0.584351 12.3062 0.584351H9.65935C8.6281 0.584351 7.8031 1.40935 7.8031 2.4406V3.02498H5.15623C4.15935 3.02498 3.33435 3.84998 3.33435 4.84685V5.8781C3.33435 6.63435 3.78123 7.2531 4.43435 7.5281L4.98435 18.9062C5.0531 20.3156 6.22185 21.4156 7.63123 21.4156H14.3C15.7093 21.4156 16.8781 20.3156 16.9469 18.9062L17.5312 7.49372C18.1844 7.21872 18.6312 6.5656 18.6312 5.84373V4.81248C18.6312 3.84998 17.8062 3.02498 16.8094 3.02498ZM9.38435 2.4406C9.38435 2.26873 9.52185 2.13123 9.69373 2.13123H12.3406C12.5125 2.13123 12.65 2.26873 12.65 2.4406V3.02498H9.41873V2.4406H9.38435ZM4.9156 4.84685C4.9156 4.70935 5.01873 4.57185 5.1906 4.57185H16.8094C16.9469 4.57185 17.0844 4.67498 17.0844 4.84685V5.8781C17.0844 6.0156 16.9812 6.1531 16.8094 6.1531H5.1906C5.0531 6.1531 4.9156 6.04998 4.9156 5.8781V4.84685V4.84685ZM14.3344 19.8687H7.6656C7.08123 19.8687 6.59998 19.4218 6.5656 18.8031L6.04998 7.6656H15.9844L15.4687 18.8031C15.4 19.3875 14.9187 19.8687 14.3344 19.8687Z'
														fill=''></path>
													<path
														d='M11 11.1375C10.5875 11.1375 10.2094 11.4812 10.2094 11.9281V16.2937C10.2094 16.7062 10.5531 17.0843 11 17.0843C11.4125 17.0843 11.7906 16.7406 11.7906 16.2937V11.9281C11.7906 11.4812 11.4125 11.1375 11 11.1375Z'
														fill=''></path>
													<path
														d='M13.7499 11.825C13.303 11.7906 12.9593 12.1 12.9249 12.5469L12.7187 15.5719C12.6843 15.9844 12.9937 16.3625 13.4405 16.3969C13.4749 16.3969 13.4749 16.3969 13.5093 16.3969C13.9218 16.3969 14.2655 16.0875 14.2655 15.675L14.4718 12.65C14.4718 12.2031 14.1624 11.8594 13.7499 11.825Z'
														fill=''></path>
													<path
														d='M8.21558 11.825C7.80308 11.8594 7.45933 12.2375 7.49371 12.65L7.73433 15.675C7.76871 16.0875 8.11246 16.3969 8.49058 16.3969C8.52496 16.3969 8.52496 16.3969 8.55933 16.3969C8.97183 16.3625 9.31558 15.9844 9.28121 15.5719L9.04058 12.5469C9.04058 12.1 8.66246 11.7906 8.21558 11.825Z'
														fill=''></path>
												</svg>
											</button>
										)}
									</div>
								</div>
							</div>
							<div className='px-6 py-3' bis_skin_checked='1'>
								<h4 className='mb-3 text-xl font-semibold text-black hover:text-primary dark:text-black dark:hover:text-primary'>
									<a href='javascript:void(0)'>{review?.reviewTitle}</a>
								</h4>
								<p>{review?.reviewMessage}</p>
								{replyID && review?._id == reviewID && (
									<div className='mt-4 reply-cont'>
										<textarea
											onChange={(e) => setReplyMsg(e.target.value)}
											defaultValue={review?.reply?.replyMessage}
											placeholder='write reply'
											className='reply-input bg-gray'></textarea>
										<div>
											<button
												onClick={handlePostReply}
												className='rounded bg-primary py-2 px-4.5 font-medium text-black hover:bg-opacity-80 mr-3'>
												{loading ? <Loader /> : 'Submit'}
											</button>
											<button
												onClick={() => {
													setIsConfirmModelShow(false)
													setReviewID(null)
												}}
												className='rounded bg-gray text-primary border-primary py-2 px-4.5 font-medium hover:bg-opacity-80'>
												Cancel
											</button>
										</div>
									</div>
								)}

								{review?.reply?.replyMessage && (
									<>
										<div className='reply-bar bg-gray'></div>
										<p className='reply-msg bg-gray'>{review?.reply?.replyMessage}</p>
									</>
								)}
							</div>
						</div>
					)
				})}
			</div>
			{isConfirmModelShow && (
				<ConfirmDeletionModel
					loading={loading}
					setConfirmModel={setIsConfirmModelShow}
					handleDeleteRequest={handleReviewDeletion}
				/>
			)}
		</>
	)
}

export default FormLayout
