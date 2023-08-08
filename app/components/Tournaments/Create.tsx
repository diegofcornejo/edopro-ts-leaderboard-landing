import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { camelCaseToWords } from '../../../libs/helpers';
import options from './options';

const CreateTournament = ({ isCreateOpen, setIsCreateOpen }) => {
	const [tournamentOptions, setTournamentOptions] = useState({
		name: '',
		// type: '',
		// status: '',
		//get actual date
		startDate: new Date().toISOString().slice(0, 10),
		banlist: '',
		mode: '',
		bestOf: '',
		rule: '',
	});

	const handleChange = (option, value) => {
		setTournamentOptions((prevParts) => ({
			...prevParts,
			[option]: value,
		}));
	};

	const handleCreateTournament = async (e) => {
		e.preventDefault();
		console.log(tournamentOptions);
		// const token = localStorage.getItem('token');
		// const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/avatar`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${token}`,
		// 	},
		// 	body: JSON.stringify({ avatar: avatarParts }),
		// });
		// const res = await response.json();
		// if (response.ok) {
		// 	toast.success('Avatar	saved ', { duration: 5000 });
		// } else {
		// 	toast.error(res.error, { duration: 5000 });
		// }
	};

	const closeModal = () => {
		setIsCreateOpen(false);
	};

	return (
		<>
			<Transition appear show={isCreateOpen} as={Fragment}>
				<Dialog as='div' className='relative z-50' onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-darkpurple border border-white p-6 text-left align-middle shadow-xl transition-all'>
									<div className='flex min-h-full items-center justify-center py-2 px-4 sm:px-6 lg:px-8'>
										<div className='w-full max-w-lg space-y-8'>
											<div>
												<h2 className='mt-6 text-center text-xl tracking-tight text-white'>
													New Tournament
												</h2>
											</div>
											<form
												className='mt-8 space-y-6'
												onSubmit={handleCreateTournament}
											>
												<div className='space-y-2 rounded-md shadow-sm'>
													<div>
														<label
															htmlFor='tournament-name'
															className='text-white'
														>
															Name
														</label>
														<input
															id='tournament-name'
															name='tournament-name'
															type='text'
															value={tournamentOptions.name}
															onChange={(e) => {
																if (e.target.value.length <= 40) {
																	handleChange(
																		'name',
																		e.target.value
																	);
																}
															}}
															required
															maxLength={40}
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
															placeholder='Name'
														/>
													</div>
													<div>
														<label
															htmlFor='tournament-mode'
															className='text-white'
														>
															Duel Mode
														</label>
														<select
															id='tournament-mode'
															name='tournament-mode'
															value={tournamentOptions.mode}
															onChange={(e) =>
																handleChange('mode', e.target.value)
															}
															required
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
														>
															<option value='' disabled>
																Select Duel Mode
															</option>
															<option value='1v1'>1v1</option>
															<option value='2v2'>2v2</option>
															<option value='3v3'>3v3</option>
															<option value='4v4'>4v4</option>
														</select>
													</div>
													<div>
														<label
															htmlFor='tournament-bestof'
															className='text-white'
														>
															Best of
														</label>
														<select
															id='tournament-bestof'
															name='tournament-bestof'
															value={tournamentOptions.bestOf}
															onChange={(e) =>
																handleChange(
																	'bestOf',
																	e.target.value
																)
															}
															required
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
														>
															<option value='' disabled>
																Select Best of
															</option>
															<option value='1'>1</option>
															<option value='3'>3</option>
															<option value='5'>5</option>
															<option value='7'>7</option>
														</select>
													</div>
													<div>
														<label
															htmlFor='tournament-banlist'
															className='text-white'
														>
															Banlist
														</label>
														<select
															id='tournament-banlist'
															name='tournament-banlist'
															value={tournamentOptions.banlist}
															onChange={(e) =>
																handleChange(
																	'banlist',
																	e.target.value
																)
															}
															required
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
														>
															<option value='' disabled>
																Select Banlist
															</option>
															<option value='TCG'>TCG</option>
															<option value='OCG'>OCG</option>
														</select>
													</div>
													<div>
														<label
															htmlFor='tournament-rule'
															className='text-white'
														>
															Master Rule
														</label>
														<select
															id='tournament-rule'
															name='tournament-rule'
															value={tournamentOptions.rule}
															onChange={(e) =>
																handleChange('rule', e.target.value)
															}
															required
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
														>
															<option value='' disabled>
																Select Rule
															</option>
															<option value='MR5'>MR5</option>
															<option value='MR4'>MR4</option>
															<option value='MR3'>MR3</option>
														</select>
													</div>
													<div>
														<label
															htmlFor='tournament-start'
															className='text-white'
														>
															Start Date
														</label>
														<input
															id='tournament-start'
															name='tournament-start'
															type='date'
															value={tournamentOptions.startDate}
															onChange={(e) =>
																handleChange(
																	'startDate',
																	e.target.value
																)
															}
															required
															className='relative block w-full appearance-none rounded-none border border-grey500 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-buttonblue focus:outline-none focus:ring-buttonblue sm:text-sm'
														/>
													</div>
												</div>
												<div>
													<button
														type='submit'
														className='group relative flex w-full justify-center rounded-md border border-transparent bg-purple py-2 px-4 text-sm font-medium text-white hover:bg-buttonblue focus:outline-none focus:ring-2 focus:ring-buttonblue focus:ring-offset-2'
													>
														Save
													</button>
												</div>
											</form>
										</div>
									</div>
									<div className='mt-4 flex justify-end'>
										<button
											type='button'
											className='inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white hover:text-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
											onClick={closeModal}
										>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default CreateTournament;