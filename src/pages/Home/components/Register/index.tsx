import {
	Dialog,
	IconButton,
	TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { List } from './components/List';
import { FormRegister } from './components/FormRegister';
import { useState } from 'react';
import * as React from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../../../../store/hooks';

// interface RegisterProps {
// 	open: boolean;
// 	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Register() {
	const [isChecked, setIsChecked] = useState(false);

	// const handleClose = () => {
	// 	setOpen(false);
	// };

	return (
		<>
			{/* <Dialog
				fullScreen
				// open={open}
				// onClose={handleClose}
				TransitionComponent={Transition}
			> */}
			{/* <Toolbar> */}
			{/* <IconButton
						edge="start"
						color="inherit"
						// onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton> */}
			{/* </Toolbar> */}
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					mt: 30.3,
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
					borderTop: '1px solid #000',
					borderLeft: '1px solid #000',
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
			{/* </Dialog> */}
		</>
	);
}
