import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import Image from 'next/image'

const Profile = ({ companyDetail }) => {
	return (
		<>
			<Breadcrumb pageName='Blog Detail' />
			<div className='overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
				<div className='relative z-20 h-35 md:h-65'>
					<Image
						src={'/images/cover/cover-01.png'}
						alt='profile cover'
						className='h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center'
						width={970}
						height={260}
					/>
				</div>
				<div className='px-4 pb-6 text-center lg:pb-8 xl:pb-11.5'>
					<div className='relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3'>
						<div className='relative drop-shadow-2 h-full w-full'>
							<img src={companyDetail?.image} className='rounded-full h-full' alt='profile' />
						</div>
					</div>
					<div className='mt-4'>
						<h3 className='mb-1.5 text-2xl font-semibold text-black dark:text-black'>{companyDetail?.title}</h3>

						<div className='mx-auto mt-5 max-w-180'>
							<h4 className='font-semibold text-black dark:text-black'>About Me</h4>
							<p className='mt-4.5'>{companyDetail?.description}</p>
						</div>

						<div className='mx-auto mt-5 max-w-180'>
							<p className='mt-4.5' dangerouslySetInnerHTML={{ __html: companyDetail?.body }}></p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Profile
