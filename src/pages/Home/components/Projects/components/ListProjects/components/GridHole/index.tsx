import { Box, Button, Grid, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import {
	useAppDispatch,
	useAppSelector,
} from '../../../../../../../../store/hooks';
import {
	createHole,
	editHole,
} from '../../../../../../../../store/modules/Hole/holeSlice';
import { listUsers } from '../../../../../../../../store/modules/User/userSlice';
import { HoleDto, Project } from '../../../../../../../../store/types';

interface GridHoleProps {
	close: () => void;
	holeNumber: string;
	setHoleNumber: React.Dispatch<React.SetStateAction<string>>;
	initialDate: string;
	setInitialDate: React.Dispatch<React.SetStateAction<string>>;
	finalDate: string;
	setFinalDate: React.Dispatch<React.SetStateAction<string>>;
	name: string;
	setName: React.Dispatch<React.SetStateAction<string>>;
	workDescription: string;
	setWorkDescription: React.Dispatch<React.SetStateAction<string>>;
	quota: string;
	setQuota: React.Dispatch<React.SetStateAction<string>>;
	waterLevel: string;
	setWaterLevel: React.Dispatch<React.SetStateAction<string>>;
	interval: string;
	setInterval: React.Dispatch<React.SetStateAction<string>>;
	waterLevelTwo: string;
	setWaterLevelTwo: React.Dispatch<React.SetStateAction<string>>;
	intervalTwo: string;
	setIntervalTwo: React.Dispatch<React.SetStateAction<string>>;
	torque: string;
	setTorque: React.Dispatch<React.SetStateAction<string>>;
	coating: string;
	setCoating: React.Dispatch<React.SetStateAction<string>>;
	ultimateDigger: string;
	setUltimateDigger: React.Dispatch<React.SetStateAction<string>>;
	initialHelical: string;
	setInitialHelical: React.Dispatch<React.SetStateAction<string>>;
	finalHelical: string;
	setFinalHelical: React.Dispatch<React.SetStateAction<string>>;
	printSpt: string;
	setPrintSpt: React.Dispatch<React.SetStateAction<string>>;
	stop: string;
	setStop: React.Dispatch<React.SetStateAction<string>>;
	textPoll: string;
	setTextPoll: React.Dispatch<React.SetStateAction<string>>;
	prober: string;
	setProber: React.Dispatch<React.SetStateAction<string>>;
	pageLines: string;
	setPageLines: React.Dispatch<React.SetStateAction<string>>;
}

export const GridHole = ({
	close,
	holeNumber,
	setHoleNumber,
	initialDate,
	setInitialDate,
	finalDate,
	setFinalDate,
	name,
	setName,
	workDescription,
	setWorkDescription,
	quota,
	setQuota,
	waterLevel,
	setWaterLevel,
	interval,
	setInterval,
	waterLevelTwo,
	setWaterLevelTwo,
	intervalTwo,
	setIntervalTwo,
	torque,
	setTorque,
	coating,
	setCoating,
	ultimateDigger,
	setUltimateDigger,
	initialHelical,
	setInitialHelical,
	finalHelical,
	setFinalHelical,
	printSpt,
	setPrintSpt,
	stop,
	setStop,
	textPoll,
	setTextPoll,
	prober,
	setProber,
	pageLines,
	setPageLines,
}: GridHoleProps) => {
	const selectedProject = useAppSelector((state) => state.holeReducer.ids);
	const selectedDate = useAppSelector((state) => state.project.entities);

	const projectId = localStorage.getItem('idProject')!;
	const sondador = localStorage.getItem('sondador');
	const project = selectedDate[projectId];

	if (project) {
		const initialDate = project.initialDate;
		const finalDate = project.finalDate;

		setInitialDate(initialDate.toString().split('T')[0]);
		setFinalDate(finalDate.toString().split('T')[0]);
		setProber(sondador!);
	}

	const selectedDescription = useAppSelector((state) =>
		state.user.projects.find(
			(description) =>
				description.id === localStorage.getItem('idProject'),
		),
	);

	useEffect(() => {
		if (selectedDescription) {
			const descriptionValue = selectedDescription.workDescription;
			setWorkDescription(descriptionValue as string);
			console.log(selectedDescription);
		}

		if (selectedProject) {
			// const number = parseInt(storedHoleNumber, 10);
			const newNumber =
				selectedProject.length === 1 ? 1 : selectedProject.length + 1;
			setHoleNumber(newNumber.toString());
		} else {
			setHoleNumber('1');
		}

		if (selectedProject) {
			// const number = parseInt(storedName.replace('SP0', ''), 10);
			const newNumber =
				selectedProject.length === 1 ? 1 : selectedProject.length + 1;
			setName(`SP${newNumber.toString().padStart(2, '0')}`);
		} else {
			setName('SP01');
		}

		const today = new Date().toISOString().split('T')[0];
		if (!initialDate) setInitialDate(today);
		if (!finalDate) setFinalDate(today);

		if (textPoll === '2') {
			setTextPoll('Sondagem Limitada');
		}

		if (textPoll === '1') {
			setTextPoll('Limite da Sondagem');
		}
	}, [
		initialDate,
		finalDate,
		setInitialDate,
		setFinalDate,
		setWorkDescription,
		textPoll,
		setTextPoll,
		setHoleNumber,
		setName,
		selectedDescription,
		selectedProject,
	]);

	const dispatch = useAppDispatch();

	const handleCreateOrUpdateHole = async (
		ev: React.FormEvent<HTMLFormElement>,
	) => {
		ev.preventDefault();

		if (initialDate && finalDate) {
			const holeData: HoleDto = {
				holeNumber,
				initialDate,
				finalDate,
				name,
				workDescription,
				quota,
				waterLevel,
				interval,
				waterLevelTwo,
				intervalTwo,
				torque,
				coating,
				ultimateDigger,
				initialHelical,
				finalHelical,
				printSpt,
				stop,
				textPoll,
				prober,
				pageLines,
			};

			try {
				if (localStorage.getItem('edit')) {
					await dispatch(
						editHole({
							id: localStorage.getItem('edit')!,
							...holeData,
						}),
					).unwrap();
				} else {
					await dispatch(
						createHole({
							projectId: localStorage.getItem('idProject')!,
							data: holeData,
						}),
					).unwrap();

					dispatch(listUsers());
				}
				close();
				localStorage.removeItem('edit');
				resetFormFields();
			} catch (error) {
				// Exibir mensagem de erro detalhada se disponível
				console.error('Erro ao criar ou atualizar o furo:', error);
				if (error instanceof AxiosError) {
					console.error('Erro detalhado:', error.response?.data);
					// Exibir mensagem de erro para o usuário
				} else {
					console.error('Erro desconhecido:', error);
				}
			}
		} else {
			console.error('Dados faltando ou inválidos.');
			// Opcional: Mostrar uma mensagem de erro para o usuário.
		}
	};

	const resetFormFields = () => {
		setHoleNumber('');
		setInitialDate('');
		setFinalDate('');
		setName('');
		setWorkDescription('');
		setQuota('');
		setWaterLevel('');
		setInterval('');
		setWaterLevelTwo('');
		setIntervalTwo('');
		setTorque('');
		setCoating('');
		setUltimateDigger('');
		setInitialHelical('');
		setFinalHelical('');
		setPrintSpt('');
		setStop('');
		setTextPoll('');
		setProber('');
		setPageLines('');
	};

	const [names, setNames] = useState<string[]>(() => {
		const savedNames = localStorage.getItem('names');
		if (savedNames) {
			return JSON.parse(savedNames);
		}
		return [];
	});

	const handleAddName = () => {
		const newName = name;

		const updateNames = [...names, newName];

		setNames(updateNames);

		localStorage.setItem('names', JSON.stringify(updateNames));
	};

	return (
		<Box
			component="form"
			onSubmit={handleCreateOrUpdateHole}
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<Grid
				container
				spacing={{ xs: 2, sm: 2, md: 2 }}
				columns={{ xs: 12, sm: 12, md: 12 }}
				sx={{
					width: '100%',
					pt: 5,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Número"
						size="small"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setHoleNumber(event.target.value)}
						value={holeNumber}
					/>
					<TextField
						label="Data Início"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setInitialDate(event.target.value)}
						value={initialDate}
					/>
					<TextField
						label="Data Finalização"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setFinalDate(event.target.value)}
						value={finalDate}
					/>
					<TextField
						label="Nome"
						size="small"
						sx={{
							flex: 1,
							m: 2,
						}}
						onChange={(event) => setName(event.target.value)}
						value={name}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Descrição da Obra"
						size="small"
						sx={{
							flex: 1,
							m: 2,
						}}
						onChange={(event) =>
							setWorkDescription(event.target.value)
						}
						value={workDescription}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Cota"
						size="small"
						sx={{
							flex: 0.1,
							m: 2,
						}}
						onChange={(event) => setQuota(event.target.value)}
						value={quota}
					/>

					<TextField
						label="Nível Água"
						size="small"
						sx={{
							flex: 0.1,
						}}
						onChange={(event) => setWaterLevel(event.target.value)}
						value={waterLevel}
					/>

					<TextField
						label="Intervalo"
						size="small"
						sx={{
							flex: 0.3,
							mr: 2,
						}}
						onChange={(event) => setInterval(event.target.value)}
						value={interval}
					/>

					<TextField
						label="Nível Água2"
						size="small"
						sx={{
							flex: 0.1,
						}}
						onChange={(event) =>
							setWaterLevelTwo(event.target.value)
						}
						value={waterLevelTwo}
					/>

					<TextField
						label="Intervalo2"
						size="small"
						sx={{
							flex: 0.3,
							mr: 2,
						}}
						onChange={(event) => setIntervalTwo(event.target.value)}
						value={intervalTwo}
					/>

					<TextField
						label="Torque (S / N)"
						size="small"
						sx={{
							flex: 0.1,
							mr: 2,
						}}
						onChange={(event) => setTorque(event.target.value)}
						value={torque}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Revestimento"
						size="small"
						sx={{
							flex: 0.16,
							mr: 2,
						}}
						onChange={(event) => setCoating(event.target.value)}
						value={coating}
					/>

					<TextField
						label="Cavadeira Final"
						size="small"
						sx={{
							flex: 0.25,
							mr: 2,
						}}
						onChange={(event) =>
							setUltimateDigger(event.target.value)
						}
						value={ultimateDigger}
					/>

					<TextField
						label="Helicoidal Inicial"
						size="small"
						sx={{
							flex: 0.25,
							mr: 2,
						}}
						onChange={(event) =>
							setInitialHelical(event.target.value)
						}
						value={initialHelical}
					/>

					<TextField
						label="Helicoidal Final"
						size="small"
						sx={{
							flex: 0.215,
							mr: 2,
						}}
						onChange={(event) =>
							setFinalHelical(event.target.value)
						}
						value={finalHelical}
					/>

					<TextField
						label="Imprime 1° S.P.T (S / N)"
						size="small"
						sx={{
							flex: 0.11,
						}}
						onChange={(event) => setPrintSpt(event.target.value)}
						value={printSpt}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Parada (1 / 2)"
						size="small"
						sx={{
							flex: 1,
							mr: 2,
							ml: 2,
						}}
						onChange={(event) => setStop(event.target.value)}
						value={stop}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label={
							textPoll === 'Limite da Sondagem'
								? 'Alterar para Sondagem Limitada - 2'
								: 'Alterar para Limite da Sondagem - 1'
						}
						size="small"
						sx={{
							flex: 1,
							mr: 2,
							ml: 2,
						}}
						onChange={(event) => setTextPoll(event.target.value)}
						value={textPoll}
					/>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Sondador"
						size="small"
						sx={{
							flex: 1,
							mr: 2,
							ml: 2,
						}}
						onChange={(event) => setProber(event.target.value)}
						value={prober}
					/>

					<TextField
						label="Quantidade Linhas Página"
						size="small"
						sx={{
							flex: 1,
							mr: 2,
							ml: 2,
						}}
						onChange={(event) => setPageLines(event.target.value)}
						value={pageLines}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center',
						mt: 5,
					}}
				>
					<Button
						type="submit"
						onClick={() => {
							handleAddName();
						}}
					>
						{localStorage.getItem('edit') ? 'Alterar' : 'Confirmar'}
					</Button>
					<Button
						onClick={() => {
							close();
						}}
					>
						Cancelar
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};
