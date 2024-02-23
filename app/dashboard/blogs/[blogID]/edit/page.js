'use client'
import { useState, useRef, MutableRefObject, useEffect, useMemo } from 'react'
import { Form, Formik, Field, FieldArray, FormikProps } from 'formik'
import slugify from 'react-slugify'
import * as Yup from 'yup'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Loader from '@/components/common/LoaderSM'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import crypto from 'crypto'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_CATEGORIES, GET_SINGLE_BLOG } from '@/app/graphql/queries'
import { UPDATE_BLOG } from '@/app/graphql/mutations'
import { toast } from 'react-toastify'
import dynamic from "next/dynamic";

const BlogSchema = Yup.object().shape({
	image: Yup.string().required('This field is required*'),
	title: Yup.string().required('This field is required*'),
	description: Yup.string().required('This field is required*'),
	body: Yup.string().required('This field is required*'),
})

const FormLayout = ({ params }) => {
	const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

	const {
		loading: loadingQuery,
		data: dataQuery,
		refetch: refetchBlogQuery,
	} = useQuery(GET_SINGLE_BLOG, {
		variables: {
			getSingleBlogId: params.blogID,
		},
	})
	const { loading: loadingCategoryQuery, data: dataCategoryQuery, refetch: refetchQuery } = useQuery(GET_ALL_CATEGORIES)
	const [UpdateBlog, { loading: createLoading, error: createError }] = useMutation(UPDATE_BLOG)

	const router = useRouter()
	const formikRef = useRef(null)
	const inputFile = useRef(null)

	const [companyLogoPreview, setCompanyLogoPreview] = useState('')
	const [imagePublicId, setImagePublicId] = useState(null)
	const [imageSignature, setImageSignature] = useState(null)

	console.log(companyLogoPreview, 'companyLogoPreview')

	useEffect(() => {
		setCompanyLogoPreview(dataQuery?.getSingleBlog?.image)
	}, [dataQuery?.getSingleBlog?.image])

	const generateSHA1 = (data) => {
		const hash = crypto.createHash('sha1')
		hash.update(data)
		return hash.digest('hex')
	}

	const generateSignature = (publicId, apiSecret) => {
		const timestamp = new Date().getTime()
		return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
	}

	const handleCompanyLogo = (event) => {
		if (formikRef.current !== null) {
			const formData = new FormData()
			formData.append('file', event.target.files[0])
			formData.append('upload_preset', 's93rrdnv')
			axios.post('https://api.cloudinary.com/v1_1/dbddpznsv/image/upload', formData).then((res) => {
				const previewUrl = res.data['secure_url']
				formikRef.current.setFieldValue('image', previewUrl)
				setCompanyLogoPreview(previewUrl)
				setImagePublicId(res.data['public_id'])
				setImageSignature(res.data['signature'])
			})
		}
	}
	const handleCompanyLogoDel = async (event) => {
		if (formikRef.current !== null) {
			const cloudName = 'dbddpznsv'
			const timestamp = new Date().getTime()
			const apiKey = '338599951488193'
			const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
			const apiSecret = 'YJubscK9NoxA3pjC9Swe_5WFmZA'
			const match = formikRef.current.values.image.match(/\/v\d+\/([^/]+)\.\w{3,4}$/)
			console.log(match, 'match')
			const imagePublicId = match ? match[1] : null
			const signature = generateSHA1(generateSignature(imagePublicId, apiSecret))

			try {
				await axios.post(url, {
					public_id: imagePublicId,
					signature: signature,
					api_key: apiKey,
					timestamp: timestamp,
				})

				formikRef.current.setFieldValue('image', '')
				setCompanyLogoPreview('')
			} catch (error) {
				console.error(error)
			}
		}

		if (inputFile.current !== null) {
			inputFile.current.value = ''
		}
	}

	return (
		<>
			<Breadcrumb pageName='Update Blog' />
			<div className='w-full'>
				<Formik
					innerRef={formikRef}
					enableReinitialize={true}
					initialValues={{
						updateBlogId: dataQuery?.getSingleBlog?._id || null,
						title: dataQuery?.getSingleBlog?.title || '',
						image: dataQuery?.getSingleBlog?.image || '',
						category: dataQuery?.getSingleBlog?.category?._id || '',
						description: dataQuery?.getSingleBlog?.description || '',
						body: dataQuery?.getSingleBlog?.body || '',
						slug: dataQuery?.getSingleBlog?.slug || '',
						metaTitle: dataQuery?.getSingleBlog?.meta_title || '',
						metaDescription: dataQuery?.getSingleBlog?.meta_description || '',
					}}
					validationSchema={BlogSchema}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						values.slug = slugify(`${values.title}${new Date().getTime()}`)
						try {
							await UpdateBlog({
								variables: values,
							})
							router.push('/dashboard/blogs')
							toast.success('Blog successfully updated')
							setSubmitting(false)
						} catch (error) {
							setSubmitting(false)
							console.log(error.message, 'error message')
						}
					}}>
					{({ values, errors, touched, isSubmitting, isValid, setFieldError, setFieldValue }) => {
						console.log(values, 'errors')
						return (
							<Form>
								<div className='grid grid-cols-5 gap-9'>
									<div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 col-span-3'>
										<div className='p-6.5'>
											<div className='mb-4.5'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Logo <span className='text-meta-1'>*</span>
												</label>
												<input
													type='file'
													ref={inputFile}
													className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
														errors.image && touched.image && 'input-error'
													}`}
													onChange={handleCompanyLogo}
												/>
												{errors.image && touched.image && <div className='error-qoute'>{errors.image}</div>}
												{companyLogoPreview != '' && (
													<div className='relative h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3'>
														<div className='relative drop-shadow-2 h-full'>
															<img alt='profile' loading='lazy' className='h-full' src={companyLogoPreview} />
															<label
																htmlFor='profile'
																onClick={handleCompanyLogoDel}
																className='absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-black hover:bg-opacity-90 sm:bottom-2 sm:right-2'>
																<svg
																	className='fill-current'
																	width='15'
																	height='15'
																	viewBox='0 0 20 20'
																	fill='none'
																	xmlns='http://www.w3.org/2000/svg'>
																	<path
																		fillRule='evenodd'
																		clipRule='evenodd'
																		d='M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z'
																		fill=''></path>
																</svg>
															</label>
														</div>
													</div>
												)}
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Title <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='title'
														placeholder='Enter your company name'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors.title && touched.title && 'input-error'
														}`}
													/>
													{errors.title && touched.title && <div className='error-qoute'>{errors.title}</div>}
												</div>
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full xl:w-1/1'>
													<label className='mb-2.5 block text-black dark:text-black'>Categories</label>
													<div className='relative z-20 bg-transparent dark:bg-form-input'>
														<Field
															as='select'
															name='category'
															className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
																errors?.category && touched?.category && 'input-error'
															}`}>
															<option value=''>Select company category</option>
															{dataCategoryQuery?.getAllCategories?.map((category, index) => {
																return (
																	<option value={category?._id} key={index}>
																		{category?.name}
																	</option>
																)
															})}
														</Field>
														<span className='absolute top-1/2 right-4 z-30 -translate-y-1/2'>
															<svg
																className='fill-current'
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'>
																<g opacity='0.8'>
																	<path
																		fillRule='evenodd'
																		clipRule='evenodd'
																		d='M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z'
																		fill=''></path>
																</g>
															</svg>
														</span>
														{errors?.category && touched?.category && (
															<div className='error-qoute'>{errors?.category}</div>
														)}
													</div>
												</div>
											</div>
											<div className='mb-6'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Description <span className='text-meta-1'>*</span>
												</label>
												<Field
													as='textarea'
													name='description'
													row={6}
													placeholder='Type blog short description'
													className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
														errors?.description && touched?.description && 'input-error'
													}`}
												/>
												{errors?.description && touched?.description && (
													<div className='error-qoute'>{errors?.description}</div>
												)}
											</div>
											<div className='mb-6'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Body <span className='text-meta-1'>*</span>
												</label>
												<ReactQuill
													theme='snow'
													value={values.body}
													onChange={(value) => {
														console.log(value, 'quill')
														formikRef.current.setFieldValue('body', value)
													}}
												/>
												{errors?.description && touched?.description && (
													<div className='error-qoute'>{errors?.description}</div>
												)}
											</div>
											<button
												type='submit'
												className='flex w-full justify-center rounded bg-primary p-3 font-medium text-gray'>
												{isSubmitting ? <Loader /> : 'Update'}
											</button>
										</div>
									</div>
									<div className='flex flex-col gap-9 col-span-2'>
										<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
											<div className='p-6.5'>
												<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
													<div className='w-full'>
														<label className='mb-2.5 block text-black dark:text-black'>Meta Title</label>
														<Field
															type='text'
															name='metaTitle'
															placeholder='Enter meta title'
															className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
														/>
													</div>
												</div>
												<div className='mb-6'>
													<label className='mb-2.5 block text-black dark:text-black'>Meta Description</label>
													<Field
														as='textarea'
														name='metaDescription'
														row={6}
														placeholder='Type meta description'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Form>
						)
					}}
				</Formik>
			</div>
		</>
	)
}

export default FormLayout
