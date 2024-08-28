import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Project } from '../../../../store/types/Project';
import { createProject } from '../../../../store/modules/Project/projectSlice';
import {
	listAllProjects,
	projectDelete,
	projectEdit,
} from '../../../../store/modules/Project/projectAdapter';
import MultipleSelect from './components/SelectClient';

interface PollProps {
	close: () => void;
	projectNumber: string;
	setProjectNumber: React.Dispatch<React.SetStateAction<string>>;
	client: string;
	setClient: React.Dispatch<React.SetStateAction<string>>;
	projectAlphanumericNumber: string;
	setProjectAlphanumericNumber: React.Dispatch<React.SetStateAction<string>>;
	workDescription: string;
	setWorkDescription: React.Dispatch<React.SetStateAction<string>>;
	workSite: string;
	setWorkSite: React.Dispatch<React.SetStateAction<string>>;
	releaseDate: string;
	setReleaseDate: React.Dispatch<React.SetStateAction<string>>;
	initialDate: string;
	setInitialDate: React.Dispatch<React.SetStateAction<string>>;
	finalDate: string;
	setFinalDate: React.Dispatch<React.SetStateAction<string>>;
	headerText: string;
	setHeaderText: React.Dispatch<React.SetStateAction<string>>;
}

export const Poll = ({
	close,
	projectNumber,
	setProjectNumber,
	client,
	setClient,
	projectAlphanumericNumber,
	setProjectAlphanumericNumber,
	workDescription,
	setWorkDescription,
	workSite,
	setWorkSite,
	releaseDate,
	setReleaseDate,
	initialDate,
	setInitialDate,
	finalDate,
	setFinalDate,
	headerText,
	setHeaderText,
}: PollProps) => {
	const [personName, setPersonName] = useState<string[]>([]);

	const projectStatus = useAppSelector((state) => state.project.project.id);

	const projectLength = useAppSelector(listAllProjects);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const today = new Date().toISOString().split('T')[0];
		if (!releaseDate) setReleaseDate(today);
		if (!initialDate) setInitialDate(today);
		if (!finalDate) setFinalDate(today);
	}, [
		releaseDate,
		initialDate,
		finalDate,
		setReleaseDate,
		setInitialDate,
		setFinalDate,
	]);

	useEffect(() => {
		setClient(personName.join(', '));
	}, [personName, setClient]);

	const handleCreateProject = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (releaseDate && initialDate && finalDate) {
			dispatch(
				createProject({
					projectNumber: String(projectLength.length + 1),
					client: client,
					projectAlphanumericNumber: projectAlphanumericNumber,
					workDescription: workDescription,
					workSite: workSite,
					releaseDate: releaseDate,
					initialDate: initialDate,
					finalDate: finalDate,
					headerText: headerText,
				}),
			);
			localStorage.setItem('workDescription', workDescription);

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
				close();
			}, 3000);
		} else {
			console.error('As datas não foram definidas corretamente.');
		}
	};

	const handleEditProject = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (releaseDate && initialDate && finalDate) {
			dispatch(
				projectEdit({
					id: projectStatus,
					projectNumber: projectNumber,
					client: client,
					projectAlphanumericNumber: projectAlphanumericNumber,
					workDescription: workDescription,
					workSite: workSite,
					releaseDate: releaseDate,
					initialDate: initialDate,
					finalDate: finalDate,
					headerText: headerText,
				}),
			);

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
		} else {
			console.error('As datas não foram definidas corretamente.');
		}
	};

	return (
		<Box
			component="form"
			onSubmit={
				localStorage.getItem('edit')
					? handleEditProject
					: handleCreateProject
			}
			sx={{
				width: '100%',
				height: '100vh',
				background: '#fff',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mt: 5,
			}}
		>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						pt: 2,
						pb: 2,
					}}
				>
					<TextField
						label="Número Projeto"
						size="small"
						sx={{
							flex: 0.1,
						}}
						value={String(projectLength.length + 1)}
					/>

					<MultipleSelect
						personName={personName}
						setPersonName={setPersonName}
					/>
				</Box>

				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						pt: 2,
						pb: 2,
					}}
				>
					<TextField
						label="Número Projeto Alfanumérico"
						size="small"
						sx={{
							flex: 0.2,
							right: 276,
						}}
						onChange={(event) =>
							setProjectAlphanumericNumber(
								event.currentTarget.value,
							)
						}
						value={projectAlphanumericNumber}
					/>
				</Box>

				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						gap: 4,
						pt: 3,
						pb: 3,
					}}
				>
					<TextField
						label="Descrição da Obra"
						size="small"
						fullWidth
						onChange={(event) =>
							setWorkDescription(event.currentTarget.value)
						}
						value={workDescription}
					/>
					<TextField
						label="Local da Obra"
						size="small"
						fullWidth
						onChange={(event) =>
							setWorkSite(event.currentTarget.value)
						}
						value={workSite}
					/>

					<TextField
						size="small"
						type="date"
						sx={{
							alignSelf: 'flex-start',
						}}
						onChange={(event) =>
							setReleaseDate(event.currentTarget.value)
						}
						value={releaseDate || ''}
					/>

					<TextField
						label="Data Início"
						size="small"
						type="date"
						sx={{
							alignSelf: 'flex-start',
						}}
						onChange={(event) =>
							setInitialDate(event.currentTarget.value)
						}
						value={initialDate || ''}
					/>

					<TextField
						label="Data Término"
						size="small"
						type="date"
						sx={{
							alignSelf: 'flex-start',
						}}
						onChange={(event) =>
							setFinalDate(event.currentTarget.value)
						}
						value={finalDate || ''}
					/>

					<TextField
						label="Texto do Cabeçalho do Relatório da Sondagem"
						size="small"
						fullWidth
						sx={{
							alignSelf: 'flex-start',
						}}
						onChange={(event) =>
							setHeaderText(event.currentTarget.value)
						}
						value={headerText}
					/>

					<Box
						sx={{
							width: '50%',
							display: 'flex',
							justifyContent: 'space-around',
							alignItems: 'center',
						}}
					>
						<Button variant="contained" type="submit">
							{localStorage.getItem('edit')
								? 'Atualizar'
								: 'Confirmar'}
						</Button>
						<Button
							variant="contained"
							onClick={() => {
								close();
							}}
						>
							Cancelar
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};
