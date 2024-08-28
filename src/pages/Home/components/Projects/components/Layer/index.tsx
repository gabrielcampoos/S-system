// import { Box, Button, Typography } from '@mui/material';
// import { useEffect, useState } from 'react';
// import GridSPT from './components/GridSPT';
// import Resistence from './components/Resistence';
// import LayerHole from './components/LayerHole';

// interface TableRow {
// 	Profundidade: number;
// 	SPT: number;
// 	Golpes1: number;
// 	Profundidade1: number;
// 	Golpes2: number;
// 	Profundidade2: number;
// 	Golpes3: number;
// 	Profundidade3: number;
// }

// export const Layer = () => {
// 	const [open, setOpen] = useState(false);
// 	const [openResistence, setOpenResistence] = useState(false);
// 	const [openLayerHole, setOpenLayerHole] = useState(false);
// 	const [names, setNames] = useState<string[]>([]);
// 	const [rows, setRows] = useState<TableRow[]>([]);

// 	useEffect(() => {
// 		const savedNames = localStorage.getItem('names');
// 		if (savedNames) {
// 			setNames(JSON.parse(savedNames));
// 		}
// 	}, []);

// 	useEffect(() => {
// 		const savedRows = localStorage.getItem('tableRows');
// 		if (savedRows) {
// 			setRows(JSON.parse(savedRows));
// 		}
// 	}, []);

// 	const totalProfundidade = rows.reduce((sum, row) => {
// 		return sum + (row.Profundidade2 || 0) + (row.Profundidade3 || 0);
// 	}, 0);

// 	return (
// 		<>
// 			<Box
// 				sx={{
// 					width: '100%',
// 					display: 'flex',
// 					justifyContent: 'center',
// 					alignItems: 'center',
// 					mt: 2,
// 					border: '1px solid #000',
// 					flexDirection: 'column',
// 				}}
// 			>
// 				<Box
// 					sx={{
// 						width: '100%',
// 						display: 'flex',
// 						justifyContent: 'space-around',
// 						alignItems: 'center',
// 					}}
// 				>
// 					<Button>Descrição de Camada</Button>
// 					<Button onClick={() => setOpen(true)}>
// 						S.P.T e S.P.T.T
// 					</Button>
// 					<Button onClick={() => setOpenResistence(true)}>
// 						Resistência a Compacidade
// 					</Button>
// 				</Box>
// 				<Box
// 					sx={{
// 						width: '100%',
// 						display: 'flex',
// 						justifyContent: 'center',
// 					}}
// 				>
// 					<Box
// 						sx={{
// 							width: '100%',
// 							display: 'flex',
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							flexDirection: 'column',
// 						}}
// 					>
// 						<Box
// 							sx={{
// 								width: '100%',
// 								display: 'flex',
// 								justifyContent: 'center',
// 								alignItems: 'center',
// 							}}
// 						>
// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									borderRight: '1px solid #000',
// 									textAlign: 'center',
// 								}}
// 							>
// 								Código
// 							</Typography>
// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									borderRight: '1px solid #000',
// 									textAlign: 'center',
// 								}}
// 							>
// 								Profundidade
// 							</Typography>
// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									borderRight: '1px solid #000',
// 									textAlign: 'center',
// 								}}
// 							>
// 								Tipo
// 							</Typography>
// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									textAlign: 'center',
// 									borderRight: '1px solid #000',
// 								}}
// 							>
// 								Descrição
// 							</Typography>

// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									textAlign: 'center',
// 									borderRight: '1px solid #000',
// 								}}
// 							>
// 								Hachura
// 							</Typography>

// 							<Typography
// 								sx={{
// 									flex: 1,
// 									borderTop: '1px solid #000',
// 									textAlign: 'center',
// 								}}
// 							>
// 								Classif. Camada
// 							</Typography>
// 						</Box>
// 					</Box>
// 				</Box>

// 				<Box
// 					sx={{
// 						width: '100%',
// 						display: 'flex',
// 						justifyContent: 'center',
// 					}}
// 				>
// 					<Box
// 						sx={{
// 							width: '100%',
// 							display: 'flex',
// 							justifyContent: 'center',
// 							alignItems: 'center',
// 							flexDirection: 'column',
// 						}}
// 					>
// 						{names.length > 0 ? (
// 							names.map((name, index) => (
// 								<Box
// 									key={index}
// 									sx={{
// 										width: '100%',
// 										display: 'flex',
// 										justifyContent: 'center',
// 										alignItems: 'center',
// 									}}
// 								>
// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											borderRight: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 											textAlign: 'center',
// 										}}
// 									>
// 										{name}
// 									</Typography>
// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											borderRight: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 											textAlign: 'center',
// 										}}
// 									>
// 										{totalProfundidade}
// 									</Typography>
// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											borderRight: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 											textAlign: 'center',
// 										}}
// 									>
// 										Teste
// 									</Typography>
// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											textAlign: 'center',
// 											borderRight: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 										}}
// 									>
// 										Teste
// 									</Typography>

// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											textAlign: 'center',
// 											borderRight: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 										}}
// 									>
// 										Teste
// 									</Typography>

// 									<Typography
// 										sx={{
// 											flex: 1,
// 											borderTop: '1px solid #000',
// 											borderBottom: '1px solid #000',
// 											textAlign: 'center',
// 										}}
// 									>
// 										Teste
// 									</Typography>
// 								</Box>
// 							))
// 						) : (
// 							<Typography
// 								sx={{
// 									width: '100%',
// 									textAlign: 'center',
// 									borderTop: '1px solid #000',
// 									borderBottom: '1px solid #000',
// 								}}
// 							>
// 								Não há dados para exibir
// 							</Typography>
// 						)}
// 					</Box>
// 				</Box>

// 				<Box
// 					sx={{
// 						width: '100%',
// 						display: 'flex',
// 						justifyContent: 'center',
// 						alignItems: 'center',
// 						mt: 5,
// 					}}
// 				>
// 					<Button onClick={() => setOpenLayerHole(true)}>
// 						Incluir
// 					</Button>
// 					<Button>Alterar</Button>
// 					<Button>Excluir</Button>
// 				</Box>
// 			</Box>

// 			<GridSPT open={open} setOpen={setOpen} />

// 			<Resistence
// 				openResistence={openResistence}
// 				setOpenResistence={setOpenResistence}
// 			/>

// 			<LayerHole
// 				openLayerHole={openLayerHole}
// 				setOpenLayerHole={setOpenLayerHole}
// 			/>
// 		</>
// 	);
// };

import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import GridSPT from './components/GridSPT';
import Resistence from './components/Resistence';
import LayerHole from './components/LayerHole';

interface TableRow {
	Profundidade: number;
	SPT: number;
	Golpes1: number;
	Profundidade1: number;
	Golpes2: number;
	Profundidade2: number;
	Golpes3: number;
	Profundidade3: number;
}

export const Layer = () => {
	const [open, setOpen] = useState(false);
	const [openResistence, setOpenResistence] = useState(false);
	const [openLayerHole, setOpenLayerHole] = useState(false);
	const [names, setNames] = useState<string[]>([]);
	const [rows, setRows] = useState<TableRow[]>([]);
	const [types, setTypes] = useState<string[]>([]);
	const [hatch, setHatch] = useState<string[]>([]);
	const [description, setDescription] = useState<string[]>([]);
	const [layer, setLayer] = useState<string[]>([]);

	useEffect(() => {
		const savedNames = localStorage.getItem('names');
		if (savedNames) {
			setNames(JSON.parse(savedNames));
		}
	}, []);

	useEffect(() => {
		const savedRows = localStorage.getItem('tableRows');
		if (savedRows) {
			setRows(JSON.parse(savedRows));
		}

		const hitTwo = rows.map((hit) => hit.Golpes2);

		const hitThree = rows.map((hit) => hit.Golpes3);

		const hitSum = hitTwo.map((value, index) => value + hitThree[index]);

		const layerResult = hitSum.map((sum) => {
			if (sum <= 4) {
				return 'Fofa';
			} else if (sum >= 5 && sum <= 8) {
				return 'Pouco compacta';
			} else if (sum >= 9 && sum <= 18) {
				return 'Medianamente compacta';
			} else if (sum >= 19 && sum <= 40) {
				return 'Compacta';
			} else {
				return 'Muito compacta';
			}
		});
		setLayer(layerResult);
	}, [rows]);

	useEffect(() => {
		const savedTypes = localStorage.getItem('types');

		const savedHatch = localStorage.getItem('hatch');

		const savedDescription = localStorage.getItem('description');

		const savedLayer = localStorage.getItem('layer');

		if (savedTypes) {
			setTypes(JSON.parse(savedTypes));
		}

		if (savedHatch) {
			setHatch(JSON.parse(savedHatch));
		}

		if (savedDescription) {
			setDescription(JSON.parse(savedDescription));
		}

		if (savedLayer) {
			setLayer(JSON.parse(savedLayer));
		}
	}, []);

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
								}}
							>
								Hachura
							</Typography>

							<Typography
								sx={{
									flex: 1,
									borderTop: '1px solid #000',
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
						{rows.length > 0 ? (
							rows.map((row, index) => {
								const totalProfundidade =
									(row.Profundidade2 || 0) +
									(row.Profundidade3 || 0);

								return (
									<Box
										key={index}
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
											{names[index] ||
												'Nome Não Disponível'}
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
											{totalProfundidade}
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
											{types[index] === '1'
												? 'Areia'
												: types[index] === '2'
													? 'Silte'
													: types[index] === '3'
														? 'Argila'
														: types[index] === '4'
															? 'Rocha'
															: 'Não definido'}
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
											{description[index] ||
												'Não definido'}
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
											{hatch[index] || 'Não definido'}
										</Typography>

										<Typography
											sx={{
												flex: 1,
												borderTop: '1px solid #000',
												borderBottom: '1px solid #000',
												textAlign: 'center',
											}}
										>
											{layer[index] || 'Não definido'}
										</Typography>
									</Box>
								);
							})
						) : (
							<Typography
								sx={{
									width: '100%',
									textAlign: 'center',
									borderTop: '1px solid #000',
									borderBottom: '1px solid #000',
								}}
							>
								Não há dados para exibir
							</Typography>
						)}
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
			/>
		</>
	);
};
