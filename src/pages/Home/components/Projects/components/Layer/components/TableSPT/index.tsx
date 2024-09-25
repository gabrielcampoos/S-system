import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, Button } from '@mui/material';
import {
	useAppDispatch,
	useAppSelector,
} from '../../../../../../../../store/hooks';
import {
	createProfundity,
	fetchProfundities,
	selectAllProfundities,
} from '../../../../../../../../store/modules/Profundity/profunditySlice';

interface RowData {
	id?: string;
	Profundidade: number;
	SPT: number;
	Golpes1: number;
	Profundidade1: number;
	Golpes2: number;
	Profundidade2: number;
	Golpes3: number;
	Profundidade3: number;
}

interface Profundity {
	id?: string;
	profundity0: number;
	spt: number;
	hit1: number;
	profundity1: number;
	hit2: number;
	profundity2: number;
	hit3: number;
	profundity3: number;
}

interface TableSPTProps {
	close: () => void;
}

export default function TableSPT({ close }: TableSPTProps) {
	const [profundidade, setProfundidade] = React.useState<number>(0);
	const [spt, setSpt] = React.useState<number>(0);
	const [golpes1, setGolpes1] = React.useState<number>(0);
	const [profundidade1, setProfundidade1] = React.useState<number>(15);
	const [golpes2, setGolpes2] = React.useState<number>(0);
	const [profundidade2, setProfundidade2] = React.useState<number>(15);
	const [golpes3, setGolpes3] = React.useState<number>(0);
	const [profundidade3, setProfundidade3] = React.useState<number>(15);
	const [rows, setRows] = React.useState<RowData[]>(() => {
		const savedRows = localStorage.getItem('tableRows');
		if (savedRows) {
			return JSON.parse(savedRows);
		}
		return [];
	});

	const dispatch = useAppDispatch();
	const profundities = useAppSelector(selectAllProfundities);

	const flattenProfundities = (profundities: Profundity[]): RowData[] => {
		const flattened = profundities.map((profundity, index) =>
			convertToRowData(profundity, index),
		);
		return flattened;
	};

	React.useEffect(() => {
		if (profundities) {
			const flattenedRows = flattenProfundities(profundities);
			setRows(flattenedRows);
		}
	}, [profundities]);

	React.useEffect(() => {
		dispatch(fetchProfundities());
	}, [dispatch]);

	const convertToRowData = (
		profundity: Profundity,
		index: number,
	): RowData => {
		return {
			Profundidade: profundity.profundity0,
			SPT: profundity.spt ?? 0,
			Golpes1: profundity.hit1 ?? 0,
			Profundidade1: profundity.profundity1 ?? 0,
			Golpes2: profundity.hit2 ?? 0,
			Profundidade2: profundity.profundity2 ?? 0,
			Golpes3: profundity.hit3 ?? 0,
			Profundidade3: profundity.profundity3 ?? 0,
		};
	};

	// Captura o evento "Enter"
	const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter') {
			handleAddRow();
		}
	};

	const handleAddRow = () => {
		const newProfundity: Profundity = {
			profundity0: profundidade,
			spt: spt,
			hit1: golpes1,
			profundity1: profundidade1,
			hit2: golpes2,
			profundity2: profundidade2,
			hit3: golpes3,
			profundity3: profundidade3,
		};

		console.log('New Profundity:', newProfundity);

		// Dispatch para criar profundidade sem redefinir imediatamente
		dispatch(
			createProfundity({
				profundities: [newProfundity],
			}),
		)
			.unwrap()
			.then(() => {
				console.log('Profundity added successfully');

				// Aqui, atualize a tabela diretamente após adicionar
				setRows((prevRows) => [
					...prevRows,
					convertToRowData(newProfundity, prevRows.length),
				]);

				// Após a adição correta, redefina os valores do formulário
				setProfundidade(newProfundity.profundity0 + 15);
				setSpt(0);
				setGolpes1(0);
				setProfundidade1(15);
				setGolpes2(0);
				setProfundidade2(15);
				setGolpes3(0);
				setProfundidade3(15);
			})
			.catch((error) => {
				console.error('Failed to add profundity: ', error);
			});
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Profundidade</TableCell>
							<TableCell align="center">SPT</TableCell>
							<TableCell align="center">Golpes1</TableCell>
							<TableCell align="center">Profundidade1</TableCell>
							<TableCell align="center">Golpes2</TableCell>
							<TableCell align="center">Profundidade2</TableCell>
							<TableCell align="center">Golpes3</TableCell>
							<TableCell align="center">Profundidade3</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.Profundidade}</TableCell>
									<TableCell align="center">
										{row.SPT}
									</TableCell>
									<TableCell align="center">
										{row.Golpes1}
									</TableCell>
									<TableCell align="center">
										{row.Profundidade1}
									</TableCell>
									<TableCell align="center">
										{row.Golpes2}
									</TableCell>
									<TableCell align="center">
										{row.Profundidade2}
									</TableCell>
									<TableCell align="center">
										{row.Golpes3}
									</TableCell>
									<TableCell align="center">
										{row.Profundidade3}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={8} align="center">
									Nenhum dado disponível
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<div style={{ margin: '20px 0' }} onKeyDown={handleKeyPress}>
				<TextField
					label="Profundidade"
					type="number"
					onChange={(event) =>
						setProfundidade(Number(event.target.value))
					}
					value={profundidade}
					size="small"
				/>
				<TextField
					label="SPT"
					type="number"
					onChange={(event) => setSpt(Number(event.target.value))}
					value={spt}
					size="small"
				/>
				<TextField
					label="Golpes1"
					type="number"
					onChange={(event) => setGolpes1(Number(event.target.value))}
					value={golpes1}
					size="small"
				/>
				<TextField
					label="Profundidade1"
					type="number"
					onChange={(event) =>
						setProfundidade1(Number(event.target.value))
					}
					value={profundidade1}
					size="small"
				/>
				<TextField
					label="Golpes2"
					type="number"
					onChange={(event) => setGolpes2(Number(event.target.value))}
					value={golpes2}
					size="small"
				/>
				<TextField
					label="Profundidade2"
					type="number"
					onChange={(event) =>
						setProfundidade2(Number(event.target.value))
					}
					value={profundidade2}
					size="small"
				/>
				<TextField
					label="Golpes3"
					type="number"
					onChange={(event) => setGolpes3(Number(event.target.value))}
					value={golpes3}
					size="small"
				/>
				<TextField
					label="Profundidade3"
					type="number"
					onChange={(event) =>
						setProfundidade3(Number(event.target.value))
					}
					value={profundidade3}
					size="small"
				/>
				<Button
					onClick={handleAddRow}
					variant="contained"
					color="primary"
					style={{
						marginLeft: '10px',
						position: 'absolute',
					}}
				>
					Adicionar Linha
				</Button>
			</div>
		</>
	);
}
