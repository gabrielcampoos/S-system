import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	Tooltip,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import GridSPT from './components/GridSPT';
import Resistence from './components/Resistence';
import LayerHole from './components/LayerHole';
import { HoleDto, HoleState, LayerDto } from '../../../../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { listHolesByProjectId } from '../../../../../../store/modules/Hole/holeSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import {
	listLayers,
	setSelectedLayerId,
} from '../../../../../../store/modules/Layer/layerSlice';
import {
	addProfundity,
	fetchProfundities,
} from '../../../../../../store/modules/Profundity/profunditySlice';
import classLayerSlice, {
	addClassification,
} from '../../../../../../store/modules/ClassLayer/classLayerSlice';

interface Layer {
	profundities: ProfundityDto[];
}

interface ProfundityDto {
	hit2?: number;
	hit3?: number;
}

interface ProfundityData {
	hit1: number;
	hit2: number;
	hit3: number;
	profundity1: number;
	profundity2: number;
	profundity3: number;
}

interface ProfundityValues {
	layerProfundities: Record<number, ProfundityData>;
	setLayerProfundities: React.Dispatch<
		React.SetStateAction<Record<number, ProfundityData>>
	>;
	hatch: string;
	setHatch: React.Dispatch<React.SetStateAction<string>>;
}

export const Layer = ({
	layerProfundities,
	setLayerProfundities,
	hatch,
	setHatch,
}: ProfundityValues) => {
	const [open, setOpen] = useState(false);
	const [openResistence, setOpenResistence] = useState(false);
	const [openLayerHole, setOpenLayerHole] = useState(false);
	const [layers, setLayers] = useState<LayerDto[] | null>(null);
	const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
	const [layerSums, setLayerSums] = useState<number[] | undefined>([]);
	const [sum, setSum] = useState<number>(0);

	const dispatch = useAppDispatch();

	const layerState = useAppSelector((state) => state.layer.currentLayers);
	const depthState = useAppSelector((state) => state.profundity.entities);

	useEffect(() => {
		if (depthState && layerState) {
			// Convertendo o Dictionary em um array para acessar os valores
			const profunditiesArray = Object.values(depthState);
			console.log('ProfunditiesArray:', profunditiesArray);

			// Mapeia as profundidades e seus índices
			const profundities0 = profunditiesArray.map(
				(entity) => entity?.profundity0,
			);

			// Obtém um array de camadas com profundidades e seus índices
			const layersWithDepths = layerState.map((layer, index) => ({
				depth: layer.depth,
				index,
				layer,
			}));

			// Acumulador para armazenar somas de todas as camadas
			const updatedLayerSums = new Array(layerState.length).fill(0);
			const updatedLayerProfundities: Record<number, ProfundityData> = {};

			// Função para arredondar profundidades
			const roundDepth = (depth: number) => Math.round(depth);

			// Itera sobre todas as profundidades e soma os valores de hit2 e hit3
			profunditiesArray.forEach((profundity) => {
				const roundedDepth = roundDepth(profundity!.profundity0 ?? 0);
				const matchingLayer = layersWithDepths.find(
					(layer) => roundDepth(layer.depth) === roundedDepth,
				);

				if (matchingLayer) {
					// Soma os valores hit2 e hit3
					const sumHit2Hit3 =
						(profundity!.hit2 ?? 0) + (profundity!.hit3 ?? 0);

					console.log(
						`Profundidade arredondada ${roundedDepth} encontrada na camada com índice ${matchingLayer.index}`,
					);
					console.log(`Soma de hit2 e hit3: ${sumHit2Hit3}`);
					console.log({ profundity }); // Loga a profundidade correspondente

					// Atualiza a soma para a camada correspondente
					updatedLayerSums[matchingLayer.index] += sumHit2Hit3; // Acrescenta os valores de hit2 e hit3

					updatedLayerProfundities[matchingLayer.index] = {
						hit1: profundity!.hit1,
						hit2: profundity!.hit2,
						hit3: profundity!.hit3,
						profundity1: profundity!.profundity1,
						profundity2: profundity!.profundity2,
						profundity3: profundity!.profundity3,
					};
				}
			});

			// Atualize o estado com as somas acumuladas
			setLayerSums(updatedLayerSums);
			setLayerProfundities(updatedLayerProfundities);

			console.log('Layer Sums:', updatedLayerSums);
		}
	}, [depthState, layerState]); // Inclua layerState nas dependências

	useEffect(() => {
		const classificationsList =
			layerState?.map((layer, index) => {
				const depth = layer.depth;
				const sum = layerSums![index] || 0;
				const description = layerState[index]?.description || '';
				return getClassification(sum, description);
			}) || [];

		dispatch(addClassification(classificationsList));
	}, [layerState, layerSums, dispatch]);

	const handleCheckboxChange = (id: string) => {
		const newSelectedLayers = selectedLayers.includes(id)
			? selectedLayers.filter((layerId) => layerId !== id)
			: [...selectedLayers, id];

		setSelectedLayers(newSelectedLayers);

		// Atualize o estado global com o ID selecionado
		dispatch(
			setSelectedLayerId(
				newSelectedLayers.length > 0 ? newSelectedLayers[0] : null,
			),
		);
	};

	const getClassification = (sum: number, desc: string): string => {
		console.log(`Sum: ${sum}, Description: ${desc}`);
		console.log(sum);

		const classifications: Record<
			string,
			{
				[range: string]: string;
			}
		> = {
			'AREIA FINA ARENOSA': {
				'0-4': 'Fofa(o)',
				'5-8': 'Pouco Compacta(o)',
				'9-18': 'Medianamente Compacta(o)',
				'19-40': 'Compacta(o)',
				'>40': 'Muito Compacta(o)',
			},
			'AREIA FINA SILTOSA': {
				'0-4': 'Fofa(o)',
				'5-8': 'Pouco Compacta(o)',
				'9-18': 'Medianamente Compacta(o)',
				'19-40': 'Compacta(o)',
				'>40': 'Muito Compacta(o)',
			},
			'AREIA FINA ARGILOSA': {
				'0-4': 'Fofa(o)',
				'5-8': 'Pouco Compacta(o)',
				'9-18': 'Medianamente Compacta(o)',
				'19-40': 'Compacta(o)',
				'>40': 'Muito Compacta(o)',
			},
			'SILTE ARENOSO': {
				'0-4': 'Fofa(o)',
				'5-8': 'Pouco Compacta(o)',
				'9-18': 'Medianamente Compacta(o)',
				'19-40': 'Compacta(o)',
				'>40': 'Muito Compacta(o)',
			},
			'SILTE SILTOSO': {
				'0-4': 'Fofa(o)',
				'5-8': 'Pouco Compacta(o)',
				'9-18': 'Medianamente Compacta(o)',
				'19-40': 'Compacta(o)',
				'>40': 'Muito Compacta(o)',
			},
			'SILTE ARGILOSO': {
				'<=2': 'Muito Mole',
				'3-5': 'Mole',
				'6-10': 'Média(o)',
				'11-19': 'Rija(o)',
				'>19': 'Dura(o)',
			},
			'ARGILA ARENOSA': {
				'<=2': 'Muito Mole',
				'3-5': 'Mole',
				'6-10': 'Média(o)',
				'11-19': 'Rija(o)',
				'>19': 'Dura(o)',
			},
			'ARGILA SILTOSA': {
				'<=2': 'Muito Mole',
				'3-5': 'Mole',
				'6-10': 'Média(o)',
				'11-19': 'Rija(o)',
				'>19': 'Dura(o)',
			},
			'ARGILA ARGILOSA': {
				'<=2': 'Muito Mole',
				'3-5': 'Mole',
				'6-10': 'Média(o)',
				'11-19': 'Rija(o)',
				'>19': 'Dura(o)',
			},
		};

		if (classifications[desc]) {
			const ranges = Object.keys(classifications[desc]);
			console.log('Ranges:', ranges);

			for (const range of ranges) {
				const [min, max] = range
					.split('-')
					.map((v) => (v === '>' ? Infinity : Number(v)));

				// Check if sum is in the range
				if (sum >= min && sum <= max) {
					console.log(`Matched range: ${range}`);
					return (
						classifications[desc][range] || 'Soma Não Disponível'
					);
				}
			}
		}

		console.log('No matching description');
		return 'Descrição Não Disponível';
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
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<Button>Descrição de Camada</Button>
					<Button onClick={() => setOpen(true)}>
						S.P.T e S.P.T.T
					</Button>
					<Button onClick={() => setOpenResistence(true)}>
						Resistência a Compacidade
					</Button>
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
							justifyContent: 'center',
							alignItems: 'center',
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
									borderTop: '1px solid #000',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
									textAlign: 'center',
								}}
							>
								Código
							</Typography>
							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
									textAlign: 'center',
								}}
							>
								Profundidade
							</Typography>
							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
									textAlign: 'center',
								}}
							>
								Tipo
							</Typography>
							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
									textAlign: 'center',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
								}}
							>
								Descrição
							</Typography>

							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
									textAlign: 'center',
									borderRight: '1px solid #000',
									borderBottom: '1px solid #000',
								}}
							>
								Hachura
							</Typography>

							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
									borderBottom: '1px solid #000',
									textAlign: 'center',
								}}
							>
								Classif. Camada
							</Typography>
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
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
						}}
					>
						{layerState?.map((layer, index) => {
							const depth = layer.depth;
							const sum = layerSums![index] || 0;

							const description =
								layerState[index]?.description || '';
							return (
								<>
									<Box
										key={layer.id}
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
												borderTop: '1px solid #000',
												borderRight: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{layer.code}
										</Typography>
										<Typography
											sx={{
												flex: 1,
												borderTop: '1px solid #000',
												borderRight: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{depth}
										</Typography>
										<Typography
											sx={{
												flex: 1,
												borderTop: '1px solid #000',
												borderRight: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{layer.type}
										</Typography>
										<Typography
											sx={{
												flex: 1,
												borderTop: '1px solid #000',
												borderRight: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{layer.description}
										</Typography>
										<Tooltip title={layer.hatch} arrow>
											<Typography
												sx={{
													flex: 1,
													borderTop: '1px solid #000',
													borderRight:
														'1px solid #000',
													borderBottom:
														'1px solid #000',
													textAlign: 'center',
													whiteSpace: 'nowrap', // Impede a quebra de linha
													overflow: 'hidden', // Oculta o texto que ultrapassa o limite
													textOverflow: 'ellipsis', // Adiciona reticências ao final do texto longo
													maxWidth: '10rem',
												}}
											>
												{layer.hatch}
											</Typography>
										</Tooltip>
										<Typography
											sx={{
												flex: 1,
												borderTop: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{getClassification(
												sum,
												description,
											)}
										</Typography>
									</Box>
									{/* <FormControlLabel
										control={
											<Checkbox
												checked={selectedLayers.includes(
													layer.id!,
												)}
												onChange={() =>
													handleCheckboxChange(
														layer.id!,
													)
												}
											/>
										}
										label=""
										sx={{
											alignSelf: 'flex-end',
											m: 0,
										}}
									/> */}
								</>
							);
						})}
					</Box>
				</Box>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						mt: 5,
					}}
				>
					<Button onClick={() => setOpenLayerHole(true)}>
						Incluir
					</Button>
					<Button>Alterar</Button>
					<Button>Excluir</Button>
				</Box>
			</Box>
			<GridSPT open={open} setOpen={setOpen} />

			<Resistence
				openResistence={openResistence}
				setOpenResistence={setOpenResistence}
			/>

			<LayerHole
				openLayerHole={openLayerHole}
				setOpenLayerHole={setOpenLayerHole}
				hatch={hatch}
				setHatch={setHatch}
			/>
		</>
	);
};
