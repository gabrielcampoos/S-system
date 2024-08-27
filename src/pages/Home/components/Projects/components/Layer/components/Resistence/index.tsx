import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import TableResistence from '../TableResistence';

interface ResistenceProps {
	openResistence: boolean;
	setOpenResistence: React.Dispatch<React.SetStateAction<boolean>>;
}

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Resistence({
	openResistence,
	setOpenResistence,
}: ResistenceProps) {
	const handleClose = () => {
		setOpenResistence(false);
	};

	return (
		<React.Fragment>
			<Dialog
				fullScreen
				open={openResistence}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar sx={{ position: 'relative' }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleClose}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography
							sx={{ ml: 2, flex: 1 }}
							variant="h6"
							component="div"
						>
							Resistência e Compacidade
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							save
						</Button>
					</Toolbar>
				</AppBar>
				<TableResistence />
			</Dialog>
		</React.Fragment>
	);
}
