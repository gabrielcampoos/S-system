import { Box, Button, Checkbox, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import {
	deleteHole,
	getHole,
	listHole,
	listHolesByProjectId,
	selectHoleById,
	selectHoles,
	setHole,
} from '../../../../../../store/modules/Hole/holeSlice';
import {
	listAllProjects,
	projectEdit,
} from '../../../../../../store/modules/Project/projectAdapter';
import {
	getProject,
	listProjects,
	selectProjectById,
	selectProjectsByUserId,
} from '../../../../../../store/modules/Project/projectSlice';
import Hole from './components/Hole';
import {
	HoleDto,
	HoleState,
	LayerState,
	Project,
} from '../../../../../../store/types';
import {
	clearCurrentLayers,
	deselectLayer,
	listLayers,
	removeLayer,
	setCurrentLayers,
	setLayers,
} from '../../../../../../store/modules/Layer/layerSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { listUsers } from '../../../../../../store/modules/User/userSlice';

interface ListProjectsProps {
	isChecked: { [key: string]: boolean };
	setIsChecked: React.Dispatch<
		React.SetStateAction<{ [key: string]: boolean }>
	>;
	isCheckedHole: { [key: string]: boolean };
	setIsCheckedHole: React.Dispatch<
		React.SetStateAction<{ [key: string]: boolean }>
	>;
	waterLevelTwo: string;
	setWaterLevelTwo: React.Dispatch<React.SetStateAction<string>>;
}

export const ListProjects = ({
	isChecked,
	setIsChecked,
	isCheckedHole,
	setIsCheckedHole,
	waterLevelTwo,
	setWaterLevelTwo,
}: ListProjectsProps) => {
	const [openHole, setOpenHole] = useState(false);
	const [selectedHoleId, setSelectedHoleId] = useState<string | null>();
	const [holeNumber, setHoleNumber] = useState('');
	const [initialDate, setInitialDate] = useState('');
	const [finalDate, setFinalDate] = useState('');
	const [name, setName] = useState('');
	const [workDescription, setWorkDescription] = useState('');
	const [quota, setQuota] = useState('');
	const [interval, setInterval] = useState('30');
	const [waterLevel, setWaterLevel] = useState('');
	const [intervalTwo, setIntervalTwo] = useState('24');
	const [torque, setTorque] = useState('N');
	const [coating, setCoating] = useState('');
	const [ultimateDigger, setUltimateDigger] = useState('');
	const [initialHelical, setInitialHelical] = useState('');
	const [finalHelical, setFinalHelical] = useState('');
	const [printSpt, setPrintSpt] = useState('N');
	const [stop, setStop] = useState('');
	const [textPoll, setTextPoll] = useState('Limite da Sondagem');
	const [prober, setProber] = useState('');
	const [pageLines, setPageLines] = useState('');
	const [userId, setUserId] = useState<string>('');
	const [selectHole, setSelectHole] = useState<HoleState[]>([]);
	const [holeValues, setHoleValues] = useState<HoleState[]>([]);
	const [projectsStorage, setProjectsStorage] = useState<Array<Project>>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [prevProjectsLength, setPrevProjectsLength] = useState<number>(0);

	const selectedUser = useAppSelector((state) => state.user);
	const holeStatus = useAppSelector((state) => state.holeReducer.currentHole);

	const dispatch = useAppDispatch();

	// useEffect(() => {
	// 	if (selectedHoleId) {
	// 		dispatch(listHolesByProjectId(selectedHoleId))
	// 			.unwrap()
	// 			.then((data) => {
	// 				if (data.success && data.data) {
	// 					setSelectHole(data.data);
	// 				} else {
	// 					console.error('Dados dos furos não recebidos.');
	// 				}
	// 			})
	// 			.catch((error: any) => {
	// 				console.error('Erro ao buscar furos:', error);
	// 			});
	// 		console.log('ID do projeto selecionado:', selectedHoleId);
	// 	}
	// }, [selectedHoleId, dispatch]);

	// useEffect(() => {
	// 	if (selectedProjectId) {
	// 		dispatch(listHolesByProjectId(selectedProjectId))
	// 			.unwrap()
	// 			.then((data) => {
	// 				if (data.success && data.data) {
	// 					setSelectHole(data.data);
	// 				} else {
	// 					console.error('Dados dos furos não recebidos.');
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				console.error('Erro ao buscar furos:', error);
	// 			});
	// 	}
	// }, [selectedProjectId, dispatch]);

	useEffect(() => {
		if (!selectedProjectId) {
			setSelectHole([]);
		}
	}, [selectedProjectId]);

	useEffect(() => {
		const userId = selectedUser.id;

		if (userId) {
			setUserId(userId);
			dispatch(listProjects(userId));
		}
	}, [dispatch, selectedUser.id]);

	const handleOpenHole = () => {
		setOpenHole((prev) => !prev);
	};

	// const handleChange =
	// 	(id: string | undefined) =>
	// 	(event: React.ChangeEvent<HTMLInputElement>) => {
	// 		const isChecked = event.target.checked;
	// 		if (id) {
	// 			setIsChecked((prevState) => ({
	// 				...prevState,
	// 				[id]: isChecked,
	// 			}));
	// 			dispatch(getProject(id));
	// 			localStorage.setItem('idProject', id);

	// 			if (isChecked) {
	// 				setSelectedProjectId(id);
	// 				dispatch(listHole(id))
	// 					.unwrap()
	// 					.then((data) => {
	// 						if (data.success && data.data) {
	// 							setSelectHole(data.data);
	// 						} else {
	// 							console.error('Dados dos furos não recebidos.');
	// 							setSelectHole([]); // Clear the list if there was an issue
	// 						}
	// 					})
	// 					.catch((error) => {
	// 						console.error('Erro ao buscar furos:', error);
	// 						setSelectHole([]); // Clear the list if there was an error
	// 					});
	// 			} else {
	// 				setSelectedProjectId(null);
	// 			}
	// 		}
	// 		console.log(isChecked, handleChange);
	// 	};

	const handleChange =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			if (!id) return;

			const isChecked = event.target.checked;

			// Atualize o estado dos checkboxes
			setIsChecked((prevState) => ({
				...prevState,
				[id]: isChecked,
			}));

			// Atualize o localStorage

			if (isChecked) {
				// Se o checkbox estiver marcado, defina o projeto selecionado e busque os furos
				setSelectedProjectId(id);
				localStorage.setItem('idProject', id);
				dispatch(listHole(id))
					.unwrap()
					.then((data) => {
						if (data.success && data.data) {
							setSelectHole(data.data);
						} else {
							console.error('Dados dos furos não recebidos.');
							setSelectHole([]); // Limpa a lista em caso de falha
						}
					})
					.catch((error) => {
						console.error('Erro ao buscar furos:', error);
						setSelectHole([]); // Limpa a lista em caso de erro
					});
			} else {
				// Se o checkbox estiver desmarcado, limpe o projeto selecionado
				setSelectedProjectId(null);
				setSelectHole([]);
			}

			// Log para depuração
			console.log(
				`Checkbox ${id} is ${isChecked ? 'checked' : 'unchecked'}`,
			);
		};

	const handleChangeHole =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const isCheckedHole = event.target.checked;

			if (id) {
				setIsCheckedHole((prevState) => ({
					...prevState,
					[id]: isCheckedHole,
				}));

				if (isCheckedHole) {
					setSelectedHoleId(id);
					localStorage.setItem('idHole', id);

					dispatch(listLayers(id))
						.unwrap()
						.then((data) => {
							if (data.success && data.data) {
								console.log(
									'Dispatching setLayers with:',
									data.data,
								);
								dispatch(setLayers(data.data)); // Atualiza as camadas com os dados recebidos
								dispatch(setCurrentLayers(data.data)); // Atualiza currentLayers com os dados recebidos
							} else {
								console.error(
									'Dados das camadas não recebidos.',
								);
								dispatch(deselectLayer(id)); // Limpa a lista se houver um problema
							}
						})
						.catch((error) => {
							console.error('Erro ao buscar camadas:', error);
							dispatch(deselectLayer(id)); // Limpa a lista em caso de erro
						});
				} else {
					setSelectedHoleId(null);
					localStorage.removeItem('idHole');
					dispatch(deselectLayer(id)); // Limpa as camadas se o furo for desmarcado
					dispatch(setLayers([])); // Remove todas as camadas do estado global
					dispatch(clearCurrentLayers()); // Limpa currentLayers
				}
			}
		};

	const handleEditHole = () => {
		setHoleNumber(holeStatus?.holeNumber || '');
		setInitialDate(holeStatus?.initialDate || '');
		setFinalDate(holeStatus?.finalDate || '');
		setName(holeStatus?.name || '');
		setWorkDescription(holeStatus?.workDescription || '');
		setCoating(holeStatus?.coating || '');
		setFinalHelical(holeStatus?.finalHelical || '');
		setInitialHelical(holeStatus?.initialHelical || '');
		setInterval(holeStatus?.interval || '');
		setIntervalTwo(holeStatus?.intervalTwo || '');
		setPageLines(holeStatus?.pageLines || '');
		setPrintSpt(holeStatus?.printSpt || '');
		setProber(holeStatus?.prober || '');
		setQuota(holeStatus?.quota || '');
		setStop(holeStatus?.stop || '');
		setTextPoll(holeStatus?.textPoll || '');
		setTorque(holeStatus?.torque || '');
		setUltimateDigger(holeStatus?.ultimateDigger || '');
		setWaterLevel(holeStatus?.waterLevel || '');
		setWaterLevelTwo(holeStatus?.waterLevelTwo || '');
		setOpenHole(true);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, 'dd/MM/yyyy');
	};

	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 2,
					border: '1px solid #000',
					flexDirection: 'column',
				}}
			>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography
						sx={{
							flex: 1,
							borderRight: '1px solid #000',
							textAlign: 'center',
						}}
					>
						Local Projeto
					</Typography>
					<Typography
						sx={{
							flex: 1,
							borderRight: '1px solid #000',
							textAlign: 'center',
						}}
					>
						Número Projeto
					</Typography>
					<Typography
						sx={{
							flex: 1,
							borderRight: '1px solid #000',
							textAlign: 'center',
						}}
					>
						Início
					</Typography>
					<Typography
						sx={{
							flex: 1,
							textAlign: 'center',
						}}
					>
						Local Obra
					</Typography>
				</Box>

				{userId &&
					selectedUser.projects.map(
						({ id, workSite, projectNumber, initialDate }) => (
							<Box
								key={id}
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Typography
									sx={{
										height: '43px',
										flex: 1,
										borderRight: '1px solid #000',
										borderTop: '1px solid #000',
										textAlign: 'center',
									}}
								>
									{workSite}
								</Typography>
								<Typography
									sx={{
										height: '43px',
										flex: 1,
										borderRight: '1px solid #000',
										borderTop: '1px solid #000',
										textAlign: 'center',
									}}
								>
									{projectNumber}
								</Typography>
								<Typography
									sx={{
										height: '43px',
										flex: 1,
										borderRight: '1px solid #000',
										borderTop: '1px solid #000',
										textAlign: 'center',
									}}
								>
									{formatDate(initialDate)}
								</Typography>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										flex: 1,
										borderTop: '1px solid #000',
									}}
								>
									<Typography
										sx={{
											height: '42px',
											flex: 1,
											textAlign: 'center',
										}}
									>
										{workSite}
									</Typography>
									{selectedUser.id !== undefined && (
										<Checkbox
											checked={!!isChecked[id!]}
											onChange={handleChange(id!)}
											sx={{
												alignSelf: 'flex-end',
											}}
										/>
									)}
								</Box>
							</Box>
						),
					)}
			</Box>

			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
					mt: 5,
					mb: 1,
					pl: 3,
				}}
			>
				<Typography>Furos</Typography>
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
						display: 'flex',
						alignItems: 'center',
						border: '1px solid #000',
						flexDirection: 'column',
					}}
				>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Typography
							sx={{
								flex: 1,
								borderRight: '1px solid #000',
								borderBottom: '1px solid #000',
								textAlign: 'center',
							}}
						>
							Nome
						</Typography>
						<Typography
							sx={{
								flex: 1,
								borderRight: '1px solid #000',
								borderBottom: '1px solid #000',
								textAlign: 'center',
							}}
						>
							Cota
						</Typography>
						<Typography
							sx={{
								flex: 1,
								borderRight: '1px solid #000',
								borderBottom: '1px solid #000',
								textAlign: 'center',
							}}
						>
							Nível Água 1
						</Typography>
						<Typography
							sx={{
								flex: 1,
								textAlign: 'center',
								borderRight: '1px solid #000',
								borderBottom: '1px solid #000',
							}}
						>
							Nível Água 2
						</Typography>
						<Typography
							sx={{
								flex: 1,
								textAlign: 'center',
								borderBottom: '1px solid #000',
							}}
						>
							Nível Água 3
						</Typography>
					</Box>

					{selectHole.length > 0 ? (
						selectHole.map(
							({
								id,
								name,
								quota,
								waterLevel,
								waterLevelTwo,
							}) => (
								<Box
									key={id}
									sx={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										borderBottom: '1px solid #000',
									}}
								>
									<Typography
										sx={{
											height: '43px',
											flex: 1,
											borderRight: '1px solid #000',
											textAlign: 'center',
										}}
									>
										{name}
									</Typography>
									<Typography
										sx={{
											flex: 1,
											height: '43px',
											borderRight: '1px solid #000',
											textAlign: 'center',
										}}
									>
										{quota}
									</Typography>
									<Typography
										sx={{
											flex: 1,
											height: '43px',
											borderRight: '1px solid #000',
											textAlign: 'center',
										}}
									>
										{Number(waterLevel)}
									</Typography>
									<Typography
										sx={{
											flex: 1,
											height: '43px',
											textAlign: 'center',
											borderRight: '1px solid #000',
										}}
									>
										{Number(waterLevelTwo)}
									</Typography>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											flex: 1,
										}}
									>
										<Typography
											sx={{
												flex: 1,
												height: '43px',
												textAlign: 'center',
											}}
										>
											{Number(waterLevel) +
												Number(waterLevelTwo)}
										</Typography>
										<Checkbox
											checked={!!isCheckedHole[id]}
											onChange={handleChangeHole(id)}
											sx={{
												alignSelf: 'flex-end',
											}}
										/>
									</Box>
								</Box>
							),
						)
					) : (
						<Typography sx={{ textAlign: 'center' }}>
							Nenhum furo encontrado.
						</Typography>
					)}
				</Box>
				<Box
					sx={{
						width: '20%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<Typography>Furo(s)</Typography>

					<Button
						onClick={() => {
							handleOpenHole();
						}}
					>
						Incluir
					</Button>
					<Button
						onClick={() => {
							handleEditHole();
							localStorage.setItem('edit', selectedHoleId!);
						}}
					>
						Alterar
					</Button>
					<Button
						onClick={async () => {
							await dispatch(deleteHole(selectedHoleId!));
							await dispatch(listProjects(userId));
						}}
					>
						Excluir
					</Button>
				</Box>
			</Box>
			<Hole
				openHole={openHole}
				setOpenHole={setOpenHole}
				close={() => {
					handleOpenHole();
				}}
				holeNumber={holeNumber}
				setHoleNumber={setHoleNumber}
				initialDate={initialDate}
				setInitialDate={setInitialDate}
				finalDate={finalDate}
				setFinalDate={setFinalDate}
				name={name}
				setName={setName}
				workDescription={workDescription}
				setWorkDescription={setWorkDescription}
				quota={quota}
				setQuota={setQuota}
				waterLevel={waterLevel}
				setWaterLevel={setWaterLevel}
				interval={interval}
				setInterval={setInterval}
				waterLevelTwo={waterLevelTwo}
				setWaterLevelTwo={setWaterLevelTwo}
				intervalTwo={intervalTwo}
				setIntervalTwo={setIntervalTwo}
				torque={torque}
				setTorque={setTorque}
				coating={coating}
				setCoating={setCoating}
				ultimateDigger={ultimateDigger}
				setUltimateDigger={setUltimateDigger}
				initialHelical={initialHelical}
				setInitialHelical={setInitialHelical}
				finalHelical={finalHelical}
				setFinalHelical={setFinalHelical}
				printSpt={printSpt}
				setPrintSpt={setPrintSpt}
				stop={stop}
				setStop={setStop}
				textPoll={textPoll}
				setTextPoll={setTextPoll}
				prober={prober}
				setProber={setProber}
				pageLines={pageLines}
				setPageLines={setPageLines}
			/>
		</>
	);
};
