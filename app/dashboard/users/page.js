import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Users from '@/components/Tables/Users'

const TablesPage = () => {
	return (
		<>
			<Breadcrumb pageName='Users' />
			<div className='grid grid-cols-1 gap-9'>
				<Users />
			</div>
		</>
	)
}

export default TablesPage
