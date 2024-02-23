'use client'
import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

const useColorMode = () => {
	const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light')

	// useEffect(() => {
	// 	const className = 'dark'
	// 	let bodyClass
	// 	// if (typeof window !== 'undefined') {
	// 	// 	bodyClass = window.document.body.classList
	// 	// }

	// 	colorMode === 'dark' ? bodyClass.add(className) : bodyClass.remove(className)
	// }, [colorMode])

	return [colorMode, setColorMode]
}

export default useColorMode
