'use client'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { redirect } from 'next/navigation'
import { useSelector } from 'react-redux'

import Loader from '@/components/common/Loader'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function RootLayout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const token = useSelector((state) => state.user.token)

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000)
	}, [])

	useLayoutEffect(() => {
		if (!token) {
			redirect('/auth/signin')
		}
	}, [])

	return (
		<html lang='en'>
			<body suppressHydrationWarning={true}>
				<div className='dark:bg-boxdark-2 dark:text-bodydark'>
					{loading ? (
						<Loader />
					) : (
						<div className='flex h-screen overflow-hidden'>
							<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
							<div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
								<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
								<main>
									<div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>{children}</div>
								</main>
							</div>
						</div>
					)}
				</div>
			</body>
		</html>
	)
}
