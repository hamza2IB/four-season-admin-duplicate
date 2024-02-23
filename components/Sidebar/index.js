import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SidebarLinkGroup from './SidebarLinkGroup'
import Image from 'next/image'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
	const pathname = usePathname()

	const trigger = useRef(null)
	const sidebar = useRef(null)

	let storedSidebarExpanded = 'true'
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
	)

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current || !trigger.current) return
			if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
			setSidebarOpen(false)
		}
		document.addEventListener('click', clickHandler)
		return () => document.removeEventListener('click', clickHandler)
	})

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ key }) => {
			if (!sidebarOpen || key !== 'Escape') return
			setSidebarOpen(false)
		}
		document.addEventListener('keydown', keyHandler)
		return () => document.removeEventListener('keydown', keyHandler)
	})

	useEffect(() => {
		localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
		if (sidebarExpanded) {
			document.querySelector('body')?.classList.add('sidebar-expanded')
		} else {
			document.querySelector('body')?.classList.remove('sidebar-expanded')
		}
	}, [sidebarExpanded])

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
				sidebarOpen ? 'translate-x-0' : '-translate-x-full'
			}`}>
			{/* <!-- SIDEBAR HEADER --> */}
			<div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
				<Link href='/dashboard'>
					<Image width={176} height={32} src={'/images/logo/logo-dark.svg'} alt='Logo' />
				</Link>

				<button
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls='sidebar'
					aria-expanded={sidebarOpen}
					className='block lg:hidden'>
					<svg
						className='fill-current'
						width='20'
						height='18'
						viewBox='0 0 20 18'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z'
							fill=''
						/>
					</svg>
				</button>
			</div>
			{/* <!-- SIDEBAR HEADER --> */}

			<div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
				{/* <!-- Sidebar Menu --> */}
				<nav className='py-4 px-4 lg:px-6'>
					{/* <!-- Menu Group --> */}
					<div>
						<ul className='mb-6 flex flex-col gap-1.5'>
							{/* <!-- Menu Item Calendar --> */}
							{/* <li>
								<Link
									href='/dashboard/calendar'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('calendar') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='18'
										height='18'
										viewBox='0 0 18 18'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z'
											fill=''
										/>
									</svg>
									Calendar
								</Link>
							</li> */}
							{/* <!-- Menu Item Calendar --> */}

							{/* <!-- Menu Item Companies --> */}
							<li>
								<Link
									href='/dashboard/users'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='22'
										height='18'
										viewBox='0 0 22 18'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z'
											fill=''></path>
										<path
											d='M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z'
											fill=''></path>
										<path
											d='M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z'
											fill=''></path>
									</svg>
									Users
								</Link>
							</li>
							{/* <!-- Menu Item Companies --> */}

							{/* <!-- Menu Item Categories --> */}
							{/* <li>
								<Link
									href='/dashboard/categories'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('categories') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='18'
										height='19'
										viewBox='0 0 18 19'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<g clipPath='url(#clip0_130_9807)'>
											<path
												d='M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z'
												fill=''></path>
											<path
												d='M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z'
												fill=''></path>
											<path
												d='M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z'
												fill=''></path>
										</g>
										<defs>
											<clipPath id='clip0_130_9807'>
												<rect width='18' height='18' fill='white' transform='translate(0 0.052124)'></rect>
											</clipPath>
										</defs>
									</svg>
									Categories
								</Link>
							</li>
							<li>
								<Link
									href='/dashboard/blogs'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('blogs') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='22'
										height='18'
										viewBox='0 0 22 18'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z'
											fill=''></path>
										<path
											d='M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z'
											fill=''></path>
										<path
											d='M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z'
											fill=''></path>
									</svg>
									Blogs
								</Link>
							</li>
							<li>
								<Link
									href='/dashboard/quotations'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('quotations') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='22'
										height='18'
										viewBox='0 0 22 18'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z'
											fill=''></path>
										<path
											d='M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z'
											fill=''></path>
										<path
											d='M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z'
											fill=''></path>
									</svg>
									Quotations
								</Link>
							</li> */}
							<li>
								<Link
									href='/dashboard/user-query'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes('inbox') && 'bg-graydark dark:bg-meta-4'
									}`}>
									<svg
										className='fill-current'
										width='18'
										height='19'
										viewBox='0 0 18 19'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M16.8749 7.44902C16.5374 7.44902 16.228 7.73027 16.228 8.0959V13.3834C16.228 14.4803 15.4124 15.3521 14.3999 15.3521H3.5999C2.55928 15.3521 1.77178 14.4803 1.77178 13.3834V8.06777C1.77178 7.73027 1.49053 7.4209 1.1249 7.4209C0.759277 7.4209 0.478027 7.70215 0.478027 8.06777V13.3553C0.478027 15.1271 1.85615 16.5896 3.57178 16.5896H14.3999C16.1155 16.5896 17.4937 15.1553 17.4937 13.3553V8.06777C17.5218 7.73027 17.2124 7.44902 16.8749 7.44902Z'
											fill=''></path>
										<path
											d='M8.5498 11.6396C8.6623 11.7521 8.83105 11.8365 8.9998 11.8365C9.16855 11.8365 9.30918 11.7803 9.4498 11.6396L12.8811 8.23652C13.1342 7.9834 13.1342 7.58965 12.8811 7.33652C12.6279 7.0834 12.2342 7.0834 11.9811 7.33652L9.64668 9.64277V2.16152C9.64668 1.82402 9.36543 1.51465 8.9998 1.51465C8.6623 1.51465 8.35293 1.7959 8.35293 2.16152V9.69902L6.01855 7.36465C5.76543 7.11152 5.37168 7.11152 5.11855 7.36465C4.86543 7.61777 4.86543 8.01152 5.11855 8.26465L8.5498 11.6396Z'
											fill=''></path>
									</svg>
									Users Queries
								</Link>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		</aside>
	)
}

export default Sidebar
