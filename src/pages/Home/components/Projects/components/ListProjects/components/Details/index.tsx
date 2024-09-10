import { Box, Grid, TextField } from '@mui/material';
import { useState } from 'react';

interface Details {
	close: () => void;
}

export const Details = ({ close }: Details) => {
	const [waterLevel3, setWaterLevel3] = useState('');
	const [waterLevel4, setWaterLevel4] = useState('');
	const [waterLevel5, setWaterLevel5] = useState('');
	const [lavagemInicio, setLavagemInicio] = useState('');
	const [lavagemTermino, setLavagemTermino] = useState('');
	const [lavagemTempo, setLavagemTempo] = useState('');
	const [profundidadeInicio, setProfundidadeInicio] = useState('');
	const [estagio1, setEstagio1] = useState('');
	const [estagio2, setEstagio2] = useState('');
	const [estagio3, setEstagio3] = useState('');

	const handleCreateOrUpdateHole = () => {
		setTimeout(() => {
			localStorage.setItem('waterLevel3', waterLevel3);
			localStorage.setItem('waterLevel4', waterLevel4);
			localStorage.setItem('waterLevel5', waterLevel5);
			localStorage.setItem('lavagemInicio', lavagemInicio);
			localStorage.setItem('lavagemTermino', lavagemTermino);
			localStorage.setItem('lavagemTempo', lavagemTempo);
			localStorage.setItem('profundidadeInicio', profundidadeInicio);
			close();
		}, 2000);
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
						label="Nível Água 3"
						size="small"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setWaterLevel3(event.target.value)}
						value={waterLevel3}
					/>
					<TextField
						label="Nível Água 4"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setWaterLevel4(event.target.value)}
						value={waterLevel4}
					/>
					<TextField
						label="Nível Água 5"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) => setWaterLevel5(event.target.value)}
						value={waterLevel5}
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
						label="Lavagem Início"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) =>
							setLavagemInicio(event.target.value)
						}
						value={lavagemInicio}
					/>

					<TextField
						label="Lavagem Término"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) =>
							setLavagemTermino(event.target.value)
						}
						value={lavagemTermino}
					/>

					<TextField
						label="Lavagem por Tempo"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) =>
							setLavagemTempo(event.target.value)
						}
						value={lavagemTempo}
					/>

					<TextField
						label="Profundidade Início"
						size="small"
						type="date"
						sx={{
							flex: 0.2,
							m: 2,
						}}
						onChange={(event) =>
							setProfundidadeInicio(event.target.value)
						}
						value={profundidadeInicio}
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
						label="Estágio 1"
						size="small"
						sx={{
							flex: 0.1,
							m: 2,
						}}
						onChange={(event) => setEstagio1(event.target.value)}
						value={estagio1}
					/>

					<TextField
						label="Estágio 2"
						size="small"
						sx={{
							flex: 0.1,
						}}
						onChange={(event) => setEstagio2(event.target.value)}
						value={estagio2}
					/>

					<TextField
						label="Estágio 3"
						size="small"
						sx={{
							flex: 0.3,
							mr: 2,
						}}
						onChange={(event) => setEstagio3(event.target.value)}
						value={estagio3}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};
