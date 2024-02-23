'use client'
import React, { useLayoutEffect } from 'react'
import { redirect } from 'next/navigation'
import ECommerce from '@/components/Dashboard/E-commerce'

export default function Home() {
	useLayoutEffect(() => {
		redirect('/dashboard')
	}, [])
	return (
		<>
			<ECommerce />
		</>
	)
}
