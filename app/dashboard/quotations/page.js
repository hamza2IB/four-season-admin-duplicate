import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Quotations from '@/components/Tables/Quotations'

const TablesPage = () => {
	return (
		<>
			<Breadcrumb pageName='Quotations' />
			<div className='grid grid-cols-1 gap-9'>
				<Quotations />
			</div>
		</>
	)
}

export default TablesPage
