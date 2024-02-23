'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Moment from 'react-moment'
import * as Yup from 'yup'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import axios from '@/js/axios'
import ConfirmDeletionModel from '@/components/Model/ConfirmDeletion'
import ConfirmUserStatus from '@/components/Model/ConfirmUserStatus'

const CategorySchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required*'),
})

const TableThree = () => {
	const [loading, setLoading] = useState(true)
	const [isLoader, setIsLoader] = useState(false)
	const [isConfirmModelShow, setIsConfirmModelShow] = useState(false)
	const [isEditConfirmModelShow, setIsEditConfirmModelShow] = useState(false)
	const [userID, setUserID] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState({})
	const [users, setUsers] = useState([
		{
			_id: 1,
			name: 'Hamza Ashfaq',
			email: 'hamza2.idenbrid@gmail.com',
			phone: '+923114340230',
			status: 'active',
		},
	])

	const getAllUsers = async () => {
		try {
			const { data } = await axios.get('/user')
			setUsers(data?.User)
			setLoading(false)
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}
	const handleUserDeletion = async () => {
		try {
			const { data } = await axios.delete(`/user/${userID}`)
			let filteredUsers = users.filter((user) => user?._id !== userID)
			setUsers(filteredUsers)
			setIsConfirmModelShow(false)
			setLoading(false)
			toast.success('User deleted successfully!')
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	const handleUserStatus = async () => {
		try {
			const { data } = await axios.delete(`/user/status/${userID}`)
			const filteredUsers = users.map((user) => {
				if (user?._id === userID) {
					return { ...user, status: user?.status == 'active' ? 'inactive' : 'active' }
				}
				return user
			})
			setUsers(filteredUsers)
			setIsEditConfirmModelShow(false)
			setLoading(false)
			toast.success('User status changed successfully!')
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllUsers()
	}, [])

	return (
		<div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
			<div className='max-w-full overflow-x-auto'>
				<SkeletonTheme baseColor='#5294e0' highlightColor='#96c7ff' borderRadius='0.5rem' duration={4}>
					<table className='w-full table-auto'>
						<thead>
							<tr className='bg-gray-2 text-left dark:bg-meta-4'>
								<th className='min-w-[220px] py-4 px-4 font-medium text-black dark:text-black xl:pl-11'>Name</th>
								<th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-black'>Email</th>
								<th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-black'>Role</th>
								<th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-black'>Created At</th>
								<th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-black'>Status</th>
								<th className='py-4 px-4 font-medium text-black dark:text-black'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{!loading &&
								users?.map((user, key) => (
									<tr key={key}>
										<td className='border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 flex items-center gap-3'>
											<h5 className='font-medium text-black dark:text-black'>{user?.name}</h5>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<p className='text-black dark:text-black'>{user?.email}</p>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>{user?.role}</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<Moment fromNow>{user?.createdAt}</Moment>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<p className='text-black dark:text-black'>{user?.status}</p>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<div className='flex items-center space-x-3.5'>
												<button
													className='hover:text-primary'
													onClick={() => {
														setIsEditConfirmModelShow(true)
														setUserID(user?._id)
													}}>
													{user?.status == 'inactive' ? (
														<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
															<g fill='none' fill-rule='evenodd'>
																<path d='M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z' />
																<path
																	fill='currentColor'
																	d='M11 4a3 3 0 1 0 0 6a3 3 0 0 0 0-6M6 7a5 5 0 1 1 10 0A5 5 0 0 1 6 7M4.413 17.601c-.323.41-.413.72-.413.899c0 .122.037.251.255.426c.249.2.682.407 1.344.582C6.917 19.858 8.811 20 11 20c.222 0 .441-.002.658-.005a1 1 0 0 1 .027 2c-.226.003-.455.005-.685.005c-2.229 0-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C2.41 20.01 2 19.345 2 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C6.425 13.695 8.605 13 11 13c.447 0 .887.024 1.316.07a1 1 0 0 1-.211 1.989C11.745 15.02 11.375 15 11 15c-2.023 0-3.843.59-5.136 1.379c-.647.394-1.135.822-1.45 1.222Zm17.295-1.533a1 1 0 0 0-1.414-1.414l-3.182 3.182l-1.414-1.414a1 1 0 0 0-1.414 1.414l2.05 2.05a1.1 1.1 0 0 0 1.556 0z'
																/>
															</g>
														</svg>
													) : (
														<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
															<path
																fill='currentColor'
																d='M14 14.252v2.09A6 6 0 0 0 6 22H4a8 8 0 0 1 10-7.749M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m7 6.586l2.121-2.121l1.415 1.414L20.414 19l2.121 2.121l-1.414 1.415L19 20.414l-2.121 2.121l-1.415-1.414L17.587 19l-2.121-2.121l1.414-1.415z'
															/>
														</svg>
													)}
												</button>
												<button
													className='hover:text-primary'
													onClick={() => {
														setIsConfirmModelShow(true)
														setUserID(user?._id)
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
										</td>
									</tr>
								))}
							{loading &&
								Array.from({ length: 20 })?.map((_, key) => (
									<tr key={key}>
										<td className='border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11'>
											<h5 className='font-medium text-black dark:text-black'>
												<Skeleton />
											</h5>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<p className='text-black dark:text-black'>
												<Skeleton />
											</p>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<p className='text-black dark:text-black'>
												<Skeleton />
											</p>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<p className='text-black dark:text-black'>
												<Skeleton />
											</p>
										</td>
										<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
											<div className='flex items-center space-x-3.5'>
												<Skeleton className='max-w-full' />
											</div>
										</td>
									</tr>
								))}
							{isConfirmModelShow && (
								<ConfirmDeletionModel
									loading={loading}
									message={'delete this user'}
									setConfirmModel={setIsConfirmModelShow}
									handleDeleteRequest={handleUserDeletion}
								/>
							)}
							{isEditConfirmModelShow && (
								<ConfirmUserStatus
									loading={loading}
									message={'change user status'}
									setConfirmModel={setIsEditConfirmModelShow}
									handleDeleteRequest={handleUserStatus}
								/>
							)}
						</tbody>
					</table>
				</SkeletonTheme>
			</div>
		</div>
	)
}

export default TableThree
