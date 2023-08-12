'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CreateTournament from './Create';
import toast from 'react-hot-toast';

const Table = ({ tournaments }) => {
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const GoToTournament = (id) => () => {
		router.push(`/tournaments/${id}`);
	};

	const handleCreate = () => {
		const session = localStorage.getItem('session');
		const role = session ? JSON.parse(session).role : '';
		if (role !== 'ADMIN') {
			toast.error('You are not authorized to create a tournament', { duration: 5000 });
			return;
			//TODO: Show suscription modal
		}
		setIsCreateOpen(true);
	};

	return (
		<>
			<div className='mx-auto max-w-7xl px-6' id='ranking-section'>
				<div className='table-b bg-navyblue p-8 overflow-x-auto'>
					<div className='flex justify-between'>
						<h3 className='text-offwhite text-2xl'>Tournaments & Events</h3>
						<button
							className='text-lg font-semibold py-2 px-4 navbutton text-white'
							onClick={handleCreate}
						>
							New Tournament (Alpha)
						</button>
						<CreateTournament
							isCreateOpen={isCreateOpen}
							setIsCreateOpen={setIsCreateOpen}
							tournaments={tournaments}
						/>
					</div>
					<table className='table-auto w-full mt-10'>
						<thead>
							<tr className='text-white bg-darkblue rounded-lg'>
								<th className='px-4 py-4 text-start font-normal'></th>
								<th className='px-4 py-4 text-start font-normal'>NAME</th>
								<th className='px-4 py-4 font-normal'>MODE</th>
								<th className='px-4 py-4 font-normal'>BESTOF</th>
								<th className='px-4 py-4 text-start font-normal'>BANLIST</th>
								<th className='px-4 py-4 text-start font-normal'>MASTER RULE</th>
								{/* <th className='px-4 py-4 text-start font-normal'>STATUS</th> */}
								<th className='px-4 py-4 text-start font-normal'>START</th>
							</tr>
						</thead>
						<tbody>
							{tournaments.map((items, i) => (
								<tr
									key={i}
									className='border-b border-b-darkblue cursor-pointer hover:bg-purple'
									onClick={GoToTournament(items.id)}
								>
									<td className='px-4 py-2 text-center text-white'>{i + 1}</td>
									<td className='px-4 py-2 text-white'>{items.name}</td>
									<td className='px-4 py-2 text-center text-white'>
										{items.mode} v {items.mode}
									</td>
									<td className='px-4 py-2 text-center text-white'>
										{items.bestOf}
									</td>
									<td className='px-4 py-2 text-white'>{items.banlist}</td>
									<td className='px-4 py-2 text-white'>{items.rule}</td>
									{/* <td className='px-4 py-2 text-white'>{items.status}</td> */}
									<td className='px-4 py-2 text-white'>{items.startDate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<Image
				src={'/images/Table/Footer.svg'}
				alt='ellipse'
				width={2460}
				height={102}
				className='md:mb-40 md:-mt-6'
			/>
		</>
	);
};

export default Table;
