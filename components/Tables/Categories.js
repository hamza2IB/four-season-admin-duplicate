'use client'
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { toast } from 'react-toastify'
import { Form, Formik, Field, FieldArray, FormikProps } from 'formik'
import Moment from 'react-moment'
import * as Yup from 'yup'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useQuery, useMutation } from '@apollo/client'
import axios from '@/js/axios'
import ConfirmDeletionModel from '@/components/Model/ConfirmDeletion'
import Loader from '@/components/common/LoaderSM'

import { GET_ALL_CATEGORIES } from '@/app/graphql/queries'
import { DELETE_CATEGORY, CREATE_CATEGORY, UPDATE_CATEGORY } from '@/app/graphql/mutations'

const CategorySchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required*'),
})

const TableThree = () => {
	const { loading: loadingQuery, data: dataQuery, refetch: refetchQuery } = useQuery(GET_ALL_CATEGORIES)
	const [CreateCategory, { loading: createLoading, error: createError }] = useMutation(CREATE_CATEGORY)
	const [UpdateCategory, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_CATEGORY)
	const [DeleteCategory, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_CATEGORY)

	const formikRef = useRef(null)
	const [isConfirmModelShow, setIsConfirmModelShow] = useState(false)
	const [categoryID, setCategoryID] = useState(null)
	const [selectedCategory, setSelectedCategory] = useState({})

	const handleCategoryDeletion = async () => {
		try {
			await DeleteCategory({ variables: { deleteCategoryId: categoryID } })
			if (!deleteError) {
				toast.success('Category deleted successfully!')
				setIsConfirmModelShow(false)
				setCategoryID(null)
				await refetchQuery()
			}
		} catch (error) {
			console.log(`Delete Category Submission error! ${error.message}`)
		}
	}
	const handleEditCategory = async (values) => {
		try {
			await UpdateCategory({
				variables: {
					updateCategoryId: selectedCategory?._id,
					name: values?.name,
				},
			})
			refetchQuery()
			setSelectedCategory({})
			toast.success('Category edited successfully!')
		} catch (error) {
			console.log(error.message)
		}
	}
	const handleCreateCategory = async (values) => {
		try {
			await CreateCategory({
				variables: {
					name: values?.name,
				},
			})
			refetchQuery()
			toast.success('Category created successfully!')
		} catch (error) {
			console.log(error.message)
		}
	}
	return (
		<>
			<div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 col-span-3'>
				<div className='max-w-full overflow-x-auto'>
					<SkeletonTheme baseColor='#5294e0' highlightColor='#96c7ff' borderRadius='0.5rem' duration={4}>
						<table className='w-full table-auto'>
							<thead>
								<tr className='bg-gray-2 text-left dark:bg-meta-4'>
									<th className='min-w-[220px] py-4 px-4 font-medium text-black dark:text-black xl:pl-11'>Category</th>
									<th className='min-w-[150px] py-4 px-4 font-medium text-black dark:text-black'>Created date</th>
									<th className='py-4 px-4 font-medium text-black dark:text-black'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{!loadingQuery &&
									dataQuery?.getAllCategories?.map((category, key) => (
										<tr key={key}>
											<td className='border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11'>
												<h5 className='font-medium text-black dark:text-black'>
													{loadingQuery ? <Skeleton /> : category?.name}
												</h5>
											</td>
											<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
												<p className='text-black dark:text-black'>
													{loadingQuery ? <Skeleton /> : <Moment fromNow>{category?.createdAt}</Moment>}
												</p>
											</td>
											<td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
												<div className='flex items-center space-x-3.5'>
													{loadingQuery ? (
														<Skeleton className='max-w-full' />
													) : (
														<>
															<button
																className='hover:text-primary'
																onClick={() => {
																	setSelectedCategory(category)
																}}>
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
															</button>
															<button
																className='hover:text-primary'
																onClick={() => {
																	setIsConfirmModelShow(true)
																	setCategoryID(category?._id)
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
														</>
													)}
												</div>
											</td>
										</tr>
									))}
								{loadingQuery &&
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
												<div className='flex items-center space-x-3.5'>
													<Skeleton className='max-w-full' />
												</div>
											</td>
										</tr>
									))}
								{isConfirmModelShow && (
									<ConfirmDeletionModel
										loading={deleteLoading}
										setConfirmModel={setIsConfirmModelShow}
										handleDeleteRequest={handleCategoryDeletion}
									/>
								)}
							</tbody>
						</table>
					</SkeletonTheme>
				</div>
			</div>
			<div className='flex flex-col gap-9 col-span-2'>
				<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
					<Formik
						innerRef={formikRef}
						enableReinitialize={true}
						initialValues={{
							name: selectedCategory?.name || '',
							type: selectedCategory?._id ? 'edit' : 'create',
						}}
						validationSchema={CategorySchema}
						onSubmit={async (values, { setSubmitting, resetForm }) => {
							if (values?.type == 'create') {
								await handleCreateCategory(values)
								resetForm()
							} else {
								await handleEditCategory(values)
								resetForm()
							}
						}}>
						{({ values, errors, touched, isSubmitting, isValid, setFieldError, setFieldValue }) => {
							return (
								<>
									<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
										<h3 className='font-medium text-black dark:text-black flex justify-between items-center'>
											{values?.type == 'edit' ? 'Edit' : 'Create'} Category
											<label htmlFor='toggle4' className='flex cursor-pointer select-none items-center'>
												<span className='ml-2'>Create &nbsp;</span>
												<div className='relative'>
													<input
														id='toggle4'
														className='sr-only'
														type='checkbox'
														checked={values?.type == 'edit' ? true : false}
														onChange={() => {
															if (values?.type == 'create' && selectedCategory?._id) {
																setFieldValue('type', 'edit')
															} else {
																setFieldValue('type', 'create')
																setSelectedCategory({})
															}
														}}
													/>
													<div className='block h-8 w-14 rounded-full bg-black'></div>
													<div
														className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
															values.type == 'edit' ? '!right-1 !translate-x-full' : 'false'
														}`}></div>
												</div>
												<span className='ml-2'>Edit</span>
											</label>
										</h3>
									</div>
									<Form>
										<div className='p-6.5'>
											<div className='mb-4.5'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Name <span className='text-meta-1'>*</span>
												</label>
												<Field
													className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
														errors.name && touched.name && 'input-error'
													}`}
													type='text'
													name='name'
													placeholder='Enter category name'
												/>
												{errors.name && touched.name && typeof errors.name === 'string' && (
													<div className='error-qoute'>{errors?.name}</div>
												)}
											</div>
											{values?.type == 'edit' ? (
												<button
													type='submit'
													className='flex w-full justify-center rounded bg-primary p-3 font-medium text-gray'>
													{updateLoading ? <Loader /> : 'Edit'}
												</button>
											) : (
												<button
													type='submit'
													className='flex w-full justify-center rounded bg-primary p-3 font-medium text-gray'>
													{createLoading ? <Loader /> : 'Create'}
												</button>
											)}
										</div>
									</Form>
								</>
							)
						}}
					</Formik>
				</div>
			</div>
		</>
	)
}

export default TableThree
