import { Box, Button, Checkbox, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import {
	deleteHole,
	getHole,
	listAllHoles,
	listHole,
} from '../../../../../../store/modules/Hole/holeSlice';
import {
	listAllProjects,
	projectEdit,
	projectList,
} from '../../../../../../store/modules/Project/projectAdapter';
import { getProject } from '../../../../../../store/modules/Project/projectSlice';
import Hole from './components/Hole';
import { HoleDto, Project } from '../../../../../../store/types';

interface ListProjectsProps {
	isChecked: { [key: string]: boolean };
	setIsChecked: React.Dispatch<
		React.SetStateAction<{ [key: string]: boolean }>
	>;
	isCheckedHole: { [key: string]: boolean };
	setIsCheckedHole: React.Dispatch<
		React.SetStateAction<{ [key: string]: boolean }>
	>;
}

export const ListProjects = ({
	isChecked,
	setIsChecked,
	isCheckedHole,
	setIsCheckedHole,
}: ListProjectsProps) => {
	const [openHole, setOpenHole] = useState(false);
	const [selectedHoleId, setSelectedHoleId] = useState('');
	const [holeNumber, setHoleNumber] = useState('');
	const [initialDate, setInitialDate] = useState('');
	const [finalDate, setFinalDate] = useState('');
	const [name, setName] = useState('');
	const [workDescription, setWorkDescription] = useState('');
	const [quota, setQuota] = useState('');
	const [waterLevel, setWaterLevel] = useState('');
	const [interval, setInterval] = useState('30');
	const [waterLevelTwo, setWaterLevelTwo] = useState('');
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

	const selectProject = useAppSelector(listAllProjects);
	const selectHole = useAppSelector(listAllHoles);
	const holeStatus = useAppSelector(
		(state) => state.hole.entities[selectedHoleId],
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(projectList());
		dispatch(listHole());
	}, [dispatch]);

	const handleOpenHole = () => {
		setOpenHole((prev) => !prev);
	};

	const handleChange =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const isChecked = event.target.checked;
			setIsChecked((prevState) => ({
				...prevState,
				[id]: isChecked,
			}));
			dispatch(getProject(id));
		};

	const handleChangeHole =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const isCheckedHole = event.target.checked;
			setIsCheckedHole((prevState) => ({
				...prevState,
				[id]: isCheckedHole,
			}));
			dispatch(getHole(id));
			setSelectedHoleId(id);
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

				{selectProject.map(
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
								<Checkbox
									checked={!!isChecked[id]}
									onChange={handleChange(id)}
									sx={{
										alignSelf: 'flex-end',
									}}
								/>
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

					{selectHole.map(
						({ id, name, quota, waterLevel, waterLevelTwo }) => (
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
							localStorage.setItem('edit', selectedHoleId);
						}}
					>
						Alterar
					</Button>
					<Button
						onClick={() => {
							dispatch(deleteHole(selectedHoleId));
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
