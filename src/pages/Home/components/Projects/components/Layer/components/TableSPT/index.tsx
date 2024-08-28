// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { TextField } from '@mui/material';

// function createData(
// 	Profundidade: number,
// 	SPT: number,
// 	Golpes1: number,
// 	Profundidade1: number,
// 	Golpes2: number,
// 	Profundidade2: number,
// 	Golpes3: number,
// 	Profundidade3: number,
// ) {
// 	return {
// 		Profundidade,
// 		SPT,
// 		Golpes1,
// 		Profundidade1,
// 		Golpes2,
// 		Profundidade2,
// 		Golpes3,
// 		Profundidade3,
// 	};
// }

// const rows = [
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// 	createData(1, 0, 0, 15, 0, 15, 0, 15),
// ];

// export default function TableSPT() {
// 	const [profundidade, setProfundidade] = React.useState(0);
// 	const [spt, setSpt] = React.useState(0);
// 	const [golpes1, setGolpes1] = React.useState(0);
// 	const [profundidade1, setProfundidade1] = React.useState(15);
// 	const [golpes2, setGolpes2] = React.useState(0);
// 	const [profundidade2, setProfundidade2] = React.useState(15);
// 	const [golpes3, setGolpes3] = React.useState(0);
// 	const [profundidade3, setProfundidade3] = React.useState(15);

// 	return (
// 		<TableContainer component={Paper}>
// 			<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 				<TableHead>
// 					<TableRow>
// 						<TableCell>Profundidade</TableCell>
// 						<TableCell align="center">SPT</TableCell>
// 						<TableCell align="center">Golpes1</TableCell>
// 						<TableCell align="center">Profundidade1</TableCell>
// 						<TableCell align="center">Golpes2</TableCell>
// 						<TableCell align="center">Profundidade2</TableCell>
// 						<TableCell align="center">Golpes3</TableCell>
// 						<TableCell align="center">Profundidade3</TableCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{rows.map((row) => (
// 						<TableRow
// 							key={row.Profundidade}
// 							sx={{
// 								'&:last-child td, &:last-child th': {
// 									border: 0,
// 								},
// 							}}
// 						>
// 							<TableCell component="th" scope="row">
// 								<TextField
// 									onChange={(event) =>
// 										setProfundidade(
// 											Number(event.target.value),
// 										)
// 									}
// 									value={profundidade}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setSpt(Number(event.target.value))
// 									}
// 									value={spt}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setGolpes1(Number(event.target.value))
// 									}
// 									value={golpes1}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setProfundidade1(
// 											Number(event.target.value),
// 										)
// 									}
// 									value={profundidade1}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setGolpes2(Number(event.target.value))
// 									}
// 									value={golpes2}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setProfundidade2(
// 											Number(event.target.value),
// 										)
// 									}
// 									value={profundidade2}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setGolpes3(Number(event.target.value))
// 									}
// 									value={golpes3}
// 									size="small"
// 								/>
// 							</TableCell>
// 							<TableCell align="center">
// 								<TextField
// 									onChange={(event) =>
// 										setProfundidade3(
// 											Number(event.target.value),
// 										)
// 									}
// 									value={profundidade3}
// 									size="small"
// 								/>
// 							</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// }
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, Button } from '@mui/material';

interface RowData {
	Profundidade: number;
	SPT: number;
	Golpes1: number;
	Profundidade1: number;
	Golpes2: number;
	Profundidade2: number;
	Golpes3: number;
	Profundidade3: number;
}

function createData(
	Profundidade: number,
	SPT: number,
	Golpes1: number,
	Profundidade1: number,
	Golpes2: number,
	Profundidade2: number,
	Golpes3: number,
	Profundidade3: number,
): RowData {
	return {
		Profundidade,
		SPT,
		Golpes1,
		Profundidade1,
		Golpes2,
		Profundidade2,
		Golpes3,
		Profundidade3,
	};
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

	const handleAddRow = () => {
		const newRow = createData(
			profundidade,
			spt,
			golpes1,
			profundidade1,
			golpes2,
			profundidade2,
			golpes3,
			profundidade3,
		);
		const updatedRows = [...rows, newRow];

		setRows(updatedRows);

		localStorage.setItem('tableRows', JSON.stringify(updatedRows));

		setProfundidade(0);
		setSpt(0);
		setGolpes1(0);
		setProfundidade1(15);
		setGolpes2(0);
		setProfundidade2(15);
		setGolpes3(0);
		setProfundidade3(15);
		close();
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
						{rows.map((row, index) => (
							<TableRow
								key={index}
								sx={{
									'&:last-child td, &:last-child th': {
										border: 0,
									},
								}}
							>
								<TableCell component="th" scope="row">
									{row.Profundidade}
								</TableCell>
								<TableCell align="center">{row.SPT}</TableCell>
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
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<div style={{ margin: '20px 0' }}>
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
