import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { List } from './components/List';
import { FormRegister } from './components/FormRegister';
import { useState } from 'react';

export default function Register() {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 3,
				}}
			>
				<TextField
					label="Pesquisar Cliente"
					size="small"
					sx={{
						'fieldset.MuiOutlinedInput-notchedOutline.css-1d3z3hw-MuiOutlinedInput-notchedOutline':
							{
								borderColor: '#fff',
								background: '#fff',
							},
					}}
				/>
			</Box>
			<Box
				sx={{
					width: '100%',
					background: '#fff',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 5,
					borderBottom: '1px solid #000',
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
					<Typography
						sx={{
							flex: 0.1,
							pl: 4.3,
							borderRight: '1px solid #000',
						}}
					>
						Cliente
					</Typography>
					<Typography
						sx={{
							flex: 1,
							pl: 5,
						}}
					>
						Nome
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
				}}
			>
				<Box
					sx={{
						width: '70%',
					}}
				>
					<List isChecked={isChecked} setIsChecked={setIsChecked} />
				</Box>
				<Box
					sx={{
						width: '30%',
					}}
				>
					<FormRegister isChecked={isChecked} />
				</Box>
			</Box>
		</>
	);
}
