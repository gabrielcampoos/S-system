import { Box, Button, TextField, Typography } from '@mui/material';
import { ListProjects } from './components/ListProjects';
import { Layer } from './components/Layer';
import { useEffect, useState } from 'react';
import { Poll } from '../Poll';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
	projectDelete,
	projectEdit,
} from '../../../../store/modules/Project/projectAdapter';
import jsPDF from 'jspdf';
import backgroundImage from '../../../../assets/images/pdf.png';
import Register from '../Register';
import { register } from 'module';
import { listProjects } from '../../../../store/modules/Project/projectSlice';
import { listUsers } from '../../../../store/modules/User/userSlice';
import { error } from 'console';
import generatePDF from './components/GeneratePDF';
import { setLayer } from '../../../../store/modules/Data/dataSlice';
import Footer from '../../../../assets/images/pdf.png';

interface ProfundityData {
	hit1: number;
	hit2: number;
	hit3: number;
	profundity1: number;
	profundity2: number;
	profundity3: number;
}

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

	const [layerProfundities, setLayerProfundities] = useState<
		Record<number, ProfundityData>
	>({});
	const [hatch, setHatch] = useState('');

	const projectStatus = useAppSelector((state) => state.project.entities);
	const holeStatus = useAppSelector((state) => state.holeReducer.entities);
	const depthState = useAppSelector((state) => state.layer.currentLayers);
	const projectStatusId = useAppSelector((state) => state.project.ids);
	const selectedUser = useAppSelector((state) => state.user);
	const classLayer = useAppSelector((state) => state.classLayer.classLayer);
	const profundityStatus = useAppSelector(
		(state) => state.profundity.entities,
	);
	const imagesStatus = useAppSelector((state) => state.layer.currentLayers);
	const idProject = localStorage.getItem('idProject');
	const idHole = localStorage.getItem('idHole');
	const project = projectStatus[idProject || ''];
	const hole = holeStatus[idHole || ''];
	const depth = depthState?.map((depth) => depth.depth);
	const images = imagesStatus?.map((hatch) => hatch.hatch);
	const layers = depthState?.map((layer, index) => {
		// Acessa os valores de profundidade e hits a partir de layerProfundities usando o index
		const profundityData = layerProfundities[index];

		// Se não houver profundityData para a camada atual, usa valores padrão (0, por exemplo)
		const hit1 = profundityData?.hit1 ?? 0;
		const hit2 = profundityData?.hit2 ?? 0;
		const hit3 = profundityData?.hit3 ?? 0;
		const hitDepth1 = profundityData?.profundity1 ?? 0;
		const hitDepth2 = profundityData?.profundity2 ?? 0;
		const hitDepth3 = profundityData?.profundity3 ?? 0;

		// Usa a classificação da camada baseada no índice
		const className = classLayer[index]; // Usa a posição no array para pegar a classificação correta

		// Obtém a imagem correspondente do `imagesStatus`
		const backgroundImage = images![index] || '';

		return {
			description: layer.description,
			depth: layer.depth,
			classLayer: className || 'Não Classificado',
			hit1: hit1,
			hit2: hit2,
			hit3: hit3,
			hitDepth1: hitDepth1,
			hitDepth2: hitDepth2,
			hitDepth3: hitDepth3,
			backgroundImage: backgroundImage,
		};
	});

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
		setProjectNumber(project!.projectNumber);
		setClient(project!.client);
		setProjectAlphanumericNumber(project!.projectAlphanumericNumber);
		setWorkDescription(project!.workDescription);
		setWorkSite(project!.workSite);
		setReleaseDate(project!.releaseDate);
		setInitialDate(project!.initialDate);
		setFinalDate(project!.finalDate);
		setHeaderText(project!.headerText);
		setDisplayPoll('visible');
	};

	const handleDeleteProject = () => {
		const findId = projectStatusId.includes(
			localStorage.getItem('idProject')!,
		);

		if (findId) {
			const id = localStorage.getItem('idProject');
			dispatch(projectDelete(id!))
				.unwrap()
				.then(() => {
					dispatch(listProjects(selectedUser.id));
					dispatch(listUsers());
				})
				.catch((error) => {
					console.error('Erro ao excluir o projeto:', error);
				});
		}

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

	//Gerar PDF
	const handleGeneratePDF = () => {
		const rawCota = hole!.quota.trim(); // Remove espaços ao redor
		const cotaInitial = parseFloat(rawCota.replace(/[^0-9.-]/g, ''));

		if (isNaN(cotaInitial)) {
			return; // Interrompe a execução se cotaInitial for inválido
		}
		// Verifique se 'layers' está definido e tem dados
		if (!layers || layers.length === 0) {
			return; // Interrompe a execução se não houver dados de camadas
		}

		const profundities = Object.values(profundityStatus).map(
			(profundity) => ({
				id: profundity!.id,
				profundity0: profundity!.profundity0,
				spt: profundity!.spt,
				hit1: profundity!.hit1,
				profundity1: profundity!.profundity1,
				hit2: profundity!.hit2,
				profundity2: profundity!.profundity2,
				hit3: profundity!.hit3,
				profundity3: profundity!.profundity3,
			}),
		);

		// Dados de exemplo
		const data = {
			username: selectedUser.username,
			obra: project!.workDescription,
			local: project!.workSite,
			furo: hole!.name,
			cota: cotaInitial,
			dataInicio: project!.initialDate,
			dataFinal: project!.finalDate,
			profundidadeCamada: depth as number[],
			layer: layers,
			profundities: profundities,
			footer: Footer,
		};
		console.log(profundityStatus);

		generatePDF({
			data: data,
		});
		console.log(layers);
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
						<Layer
							layerProfundities={layerProfundities}
							setLayerProfundities={setLayerProfundities}
							hatch={hatch}
							setHatch={setHatch}
						/>
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

			<Button
				color="error"
				variant="contained"
				onClick={handleGeneratePDF}
			>
				Gerar PDF
			</Button>
		</>
	);
};
