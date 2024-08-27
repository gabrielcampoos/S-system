import { Box, Button, TextField, Typography } from '@mui/material';
import { ListProjects } from './components/ListProjects';
import { Layer } from './components/Layer';
import { useState } from 'react';
import { Poll } from '../Poll';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
	projectDelete,
	projectEdit,
} from '../../../../store/modules/Project/projectAdapter';

export const Projects = () => {
	const [displayPoll, setDisplayPoll] = useState('none');
	const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({});
	const [isCheckedHole, setIsCheckedHole] = useState<{
		[key: string]: boolean;
	}>({});
	const [projectNumber, setProjectNumber] = useState('');
	const [client, setClient] = useState('');
	const [projectAlphanumericNumber, setProjectAlphanumericNumber] =
		useState('');
	const [workDescription, setWorkDescription] = useState('');
	const [workSite, setWorkSite] = useState('');
	const [releaseDate, setReleaseDate] = useState<string>('');
	const [initialDate, setInitialDate] = useState<string>('');
	const [finalDate, setFinalDate] = useState<string>('');
	const [headerText, setHeaderText] = useState('');

	const projectStatus = useAppSelector((state) => state.project.project);

	const dispatch = useAppDispatch();

	function handleDisplayPoll() {
		displayPoll === 'none'
			? setDisplayPoll('visible')
			: setDisplayPoll('none');
	}

	function handleClose() {
		displayPoll === 'none'
			? setDisplayPoll('visible')
			: setDisplayPoll('none');
		setProjectNumber('');
		setClient('');
		setProjectAlphanumericNumber('');
		setWorkDescription('');
		setWorkSite('');
		setReleaseDate('');
		setInitialDate('');
		setFinalDate('');
		setHeaderText('');
	}

	const handleEditProject = () => {
		setProjectNumber(projectStatus.projectNumber);
		setClient(projectStatus.client);
		setProjectAlphanumericNumber(projectStatus.projectAlphanumericNumber);
		setWorkDescription(projectStatus.workDescription);
		setWorkSite(projectStatus.workSite);
		setReleaseDate(projectStatus.releaseDate);
		setInitialDate(projectStatus.initialDate);
		setFinalDate(projectStatus.finalDate);
		setHeaderText(projectStatus.headerText);
		setDisplayPoll('visible');
	};

	const handleDeleteProject = () => {
		dispatch(projectDelete(projectStatus.id));

		setTimeout(() => {
			setProjectNumber('');
			setClient('');
			setProjectAlphanumericNumber('');
			setWorkDescription('');
			setWorkSite('');
			setReleaseDate('');
			setInitialDate('');
			setFinalDate('');
			setHeaderText('');
		}, 3000);
	};

	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 5,
					flexDirection: 'column',
					background: '#fff',
					pt: 2,
					pb: 2,
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-evenly',
						alignItems: 'center',
					}}
				>
					<TextField label="Filtrar Obra" size="small" />
					<TextField label="Filtrar Projeto Número" size="small" />
					<TextField label="Filtrar Local Obra" size="small" />
				</Box>

				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						mt: 3,
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}
					>
						<Box
							sx={{
								width: '40%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							<Typography component="h1" variant="h5">
								Projeto(s)
							</Typography>

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Button onClick={handleDisplayPoll}>
									Incluir
								</Button>
								<Button
									onClick={() => {
										handleEditProject();
										localStorage.setItem('edit', 'true');
									}}
								>
									Alterar
								</Button>
								<Button onClick={handleDeleteProject}>
									Excluir
								</Button>
							</Box>
						</Box>
					</Box>
				</Box>

				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Box
						sx={{
							width: '100%',
						}}
					>
						<ListProjects
							isChecked={isChecked}
							setIsChecked={setIsChecked}
							isCheckedHole={isCheckedHole}
							setIsCheckedHole={setIsCheckedHole}
						/>
					</Box>

					<Box
						sx={{
							width: '100%',
						}}
					>
						<Layer />
					</Box>
				</Box>
			</Box>

			<Box
				display={displayPoll}
				sx={{
					width: '100%',
					position: 'absolute ',
					top: 0,
					zIndex: 1,
				}}
			>
				<Poll
					projectNumber={projectNumber}
					setProjectNumber={setProjectNumber}
					client={client}
					setClient={setClient}
					projectAlphanumericNumber={projectAlphanumericNumber}
					setProjectAlphanumericNumber={setProjectAlphanumericNumber}
					workDescription={workDescription}
					setWorkDescription={setWorkDescription}
					workSite={workSite}
					setWorkSite={setWorkSite}
					releaseDate={releaseDate}
					setReleaseDate={setReleaseDate}
					initialDate={initialDate}
					setInitialDate={setInitialDate}
					finalDate={finalDate}
					setFinalDate={setFinalDate}
					headerText={headerText}
					setHeaderText={setHeaderText}
					close={handleClose}
				/>
			</Box>
		</>
	);
};
