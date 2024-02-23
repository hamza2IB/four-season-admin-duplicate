import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Queries from '@/components/Tables/Queries'

const TablesPage = () => {
	return (
		<>
			<Breadcrumb pageName='Queries' />
			<div className='grid grid-cols-1 gap-9'>
				<Queries />
			</div>
		</>
	)
}

export default TablesPage
