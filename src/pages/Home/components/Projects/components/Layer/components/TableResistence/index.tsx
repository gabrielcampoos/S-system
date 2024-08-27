import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';

function createData(
	AlturaInicial: number,
	AlturaFinal: number,
	Descricao: string,
) {
	return {
		AlturaInicial,
		AlturaFinal,
		Descricao,
	};
}

const rows = [
	createData(1, 2, 'Medianamente compacta'),
	createData(2, 3, 'Pouco compacta'),
	createData(3, 5, 'Fofa'),
	createData(5, 9, 'Pouco compacta'),
	createData(9, 15, 'Medianamente compacta'),
	createData(15, 17.21, 'Muito compacta'),
];

export default function TableResistence() {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Altura Inicial</TableCell>
						<TableCell align="center">Altura Final</TableCell>
						<TableCell align="center">Descrição</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.AlturaInicial}
							sx={{
								'&:last-child td, &:last-child th': {
									border: 0,
								},
							}}
						>
							<TableCell component="th" scope="row">
								<TextField
									label={row.AlturaInicial}
									size="small"
								/>
							</TableCell>
							<TableCell align="center">
								<TextField
									label={row.AlturaFinal}
									size="small"
								/>
							</TableCell>
							<TableCell align="center">
								<TextField label={row.Descricao} size="small" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
