import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Categories from '@/components/Tables/Categories'

const TablesPage = () => {
	return (
		<>
			<Breadcrumb pageName='Categories' />
			<div className='grid grid-cols-5 gap-9'>
				<Categories />
			</div>
		</>
	)
}

export default TablesPage
