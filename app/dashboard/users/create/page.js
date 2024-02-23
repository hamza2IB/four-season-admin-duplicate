'use client'
import { useState, useRef, MutableRefObject, useEffect } from 'react'
import { Form, Formik, Field, FieldArray, FormikProps } from 'formik'
import * as Yup from 'yup'
import axios from '@/js/axios'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Loader from '@/components/common/LoaderSM'
import { useRouter } from 'next/navigation'

const CompanySchema = Yup.object().shape({
	logo: Yup.mixed()
		.required('This field is required*')
		.test('fileFormat', 'Unsupported file format. Please upload a JPG, JPEG or PNG file.', (value) => {
			if (value instanceof File) {
				return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
			} else if (typeof value === 'string') {
				return true
			} else {
				return false
			}
		}),
	name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required*'),
	email: Yup.string().email('Email is invalid').required('This field is required*'),
	phone: Yup.string().required('This field is required*'),
	website: Yup.string().url('Please enter a valid URL').required('This field is required*'),
	description: Yup.string().required('This field is required*'),
	category: Yup.string().required('This field is required*'),
	address: Yup.object().shape({
		country: Yup.string().required('Country is required'),
		state: Yup.string().required('State is required'),
		city: Yup.string().required('City is required'),
		streetAddress: Yup.string().required('Street Address is required'),
		postalCode: Yup.string().required('Postal Code is required'),
	}),
})

const FormLayout = ({ params }) => {
	const router = useRouter()
	const formikRef = useRef(null)
	const inputFile = useRef(null)

	const [loading, setLoading] = useState(true)
	const [categories, setCategories] = useState([])
	const [companyLogoPreview, setCompanyLogoPreview] = useState('')

	const handleCompanyLogo = (event) => {
		if (formikRef.current !== null) {
			console.log(event.target.files[0], 'event.target.files[0')
			formikRef.current.setFieldValue('logo', event.target.files[0])
		}
		const previewUrl = URL.createObjectURL(event.target.files[0])
		setCompanyLogoPreview(previewUrl)
	}
	const handleCompanyLogoDel = (event) => {
		if (formikRef.current !== null) {
			formikRef.current.setFieldValue('logo', '')
		}
		if (inputFile.current !== null) {
			inputFile.current.value = ''
		}
		setCompanyLogoPreview('')
	}
	const getAllCategories = async () => {
		try {
			const { data } = await axios.get('/category')
			setCategories(data)
			setLoading(false)
		} catch (error) {
			console.log(error.message)
			setLoading(false)
		}
	}

	useEffect(() => {
		getAllCategories()
	}, [])

	return (
		<>
			<Breadcrumb pageName='Create Company' />
			<div className='w-full'>
				<div className='flex flex-col gap-9'>
					<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
						<Formik
							innerRef={formikRef}
							enableReinitialize={true}
							initialValues={{
								logo: '',
								name: '',
								email: '',
								description: '',
								userID: null,
								address: {
									country: '',
									state: '',
									city: '',
									streetAddress: '',
									postalCode: '',
								},
								website: '',
								phone: '',
								category: '',
								status: 'active',
								sociallinks: [
									{
										platform: 'Facebook',
										url: '',
									},
									{
										platform: 'LinkedIn',
										url: '',
									},
									{
										platform: 'Instagram',
										url: '',
									},
									{
										platform: 'YouTube',
										url: '',
									},
								],
							}}
							validationSchema={CompanySchema}
							onSubmit={async (values, { setSubmitting, resetForm }) => {
								const formData = new FormData()

								try {
									// Append each field to FormData
									Object.keys(values).forEach((key) => {
										if (key === 'sociallinks') {
											values[key].forEach((socialLink, index) => {
												Object.keys(socialLink).forEach((socialKey) => {
													formData.append(`${key}[${index}].${socialKey}`, socialLink[socialKey])
												})
											})
										} else if (key === 'address') {
											Object.keys(values[key]).forEach((addressKey) => {
												formData.append(`${key}.${addressKey}`, values[key][addressKey])
											})
										} else {
											formData.append(key, values[key])
										}
									})
									await axios.post('/company/create', formData, {
										headers: {
											'Content-Type': 'multipart/form-data',
										},
									})
									router.push('/dashboard/companies')
									setSubmitting(false)
								} catch (error) {
									setSubmitting(false)
									console.log(error.message, 'error message')
								}
							}}>
							{({ values, errors, touched, isSubmitting, isValid, setFieldError, setFieldValue }) => {
								console.log(errors)
								return (
									<Form>
										<div className='p-6.5'>
											<div className='mb-4.5'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Logo <span className='text-meta-1'>*</span>
												</label>
												<input
													type='file'
													ref={inputFile}
													className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
														errors.logo && touched.logo && 'input-error'
													}`}
													onChange={handleCompanyLogo}
												/>
												{errors.logo && touched.logo && <div className='error-qoute'>{errors.logo}</div>}
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
																<input id='profile' className='sr-only' type='file' name='profile' />
															</label>
														</div>
													</div>
												)}
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Name <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='name'
														placeholder='Enter your company name'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors.name && touched.name && 'input-error'
														}`}
													/>
													{errors.name && touched.name && <div className='error-qoute'>{errors.name}</div>}
												</div>
												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Email <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='email'
														name='email'
														placeholder='Enter your email address'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors.email && touched.email && 'input-error'
														}`}
													/>
													{errors.email && touched.email && <div className='error-qoute'>{errors.email}</div>}
												</div>
												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Phone Number <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='tel'
														name='phone'
														placeholder='Enter your phone number'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors.phone && touched.phone && 'input-error'
														}`}
													/>
													{errors.phone && touched.phone && <div className='error-qoute'>{errors.phone}</div>}
												</div>
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Country <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='address.country'
														placeholder='Enter your country name'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.address?.country && touched?.address?.country && 'input-error'
														}`}
													/>
													{errors?.address?.country && touched?.address?.country && (
														<div className='error-qoute'>{errors?.address?.country}</div>
													)}
												</div>

												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														State <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='address.state'
														placeholder='Enter your state name'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.address?.state && touched?.address?.state && 'input-error'
														}`}
													/>
													{errors?.address?.state && touched?.address?.state && (
														<div className='error-qoute'>{errors?.address?.state}</div>
													)}
												</div>

												<div className='w-full xl:w-1/3'>
													<label className='mb-2.5 block text-black dark:text-black'>
														City <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='address.city'
														placeholder='Enter your city name'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.address?.city && touched?.address?.city && 'input-error'
														}`}
													/>
													{errors?.address?.city && touched?.address?.city && (
														<div className='error-qoute'>{errors?.address?.city}</div>
													)}
												</div>
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full xl:w-1/2'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Postal Code <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='address.postalCode'
														placeholder='Enter your postal code'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.address?.postalCode && touched?.address?.postalCode && 'input-error'
														}`}
													/>
													{errors?.address?.postalCode && touched?.address?.postalCode && (
														<div className='error-qoute'>{errors?.address?.postalCode}</div>
													)}
												</div>

												<div className='w-full xl:w-1/1'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Street Address <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='text'
														name='address.streetAddress'
														placeholder='Enter your street address'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.address?.streetAddress && touched?.address?.streetAddress && 'input-error'
														}`}
													/>
													{errors?.address?.streetAddress && touched?.address?.streetAddress && (
														<div className='error-qoute'>{errors?.address?.streetAddress}</div>
													)}
												</div>
											</div>
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												<div className='w-full xl:w-1/2'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Website URL <span className='text-meta-1'>*</span>
													</label>
													<Field
														type='url'
														name='website'
														placeholder='Enter your website url'
														className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
															errors?.website && touched?.website && 'input-error'
														}`}
													/>
													{errors?.website && touched?.website && <div className='error-qoute'>{errors?.website}</div>}
												</div>
												<div className='w-full xl:w-1/1'>
													<label className='mb-2.5 block text-black dark:text-black'>
														Categories <span className='text-meta-1'>*</span>
													</label>
													<div className='relative z-20 bg-transparent dark:bg-form-input'>
														<Field
															as='select'
															name='category'
															className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
																errors?.category && touched?.category && 'input-error'
															}`}>
															<option value=''>Select company category</option>
															{categories?.map((category, index) => {
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
											<div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
												{values?.sociallinks?.map((link, index) => (
													<div key={index} className='w-full xl:w-1/4'>
														<label className='mb-2.5 block text-black dark:text-black'>{link.platform}</label>
														<Field
															type='url'
															name={`sociallinks[${index}].url`}
															placeholder={`Enter company ${link.platform} link`}
															className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
														/>
													</div>
												))}
											</div>
											<div className='mb-6'>
												<label className='mb-2.5 block text-black dark:text-black'>
													Description <span className='text-meta-1'>*</span>
												</label>
												<Field
													as='textarea'
													name='description'
													row={6}
													placeholder='Type company description'
													className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
														errors?.description && touched?.description && 'input-error'
													}`}
												/>
												{errors?.description && touched?.description && (
													<div className='error-qoute'>{errors?.description}</div>
												)}
											</div>
											<button
												type='submit'
												className='flex w-full justify-center rounded bg-primary p-3 font-medium text-gray'>
												{isSubmitting ? <Loader /> : 'Create'}
											</button>
										</div>
									</Form>
								)
							}}
						</Formik>
					</div>
				</div>
			</div>
		</>
	)
}

export default FormLayout
