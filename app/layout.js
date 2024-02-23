'use client'
import CustomProvider from './providers/LayoutProvider'
import './globals.css'
import './data-tables-css.css'
import './satoshi.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body suppressHydrationWarning={true}>
				<CustomProvider>{children}</CustomProvider>
			</body>
		</html>
	)
}
