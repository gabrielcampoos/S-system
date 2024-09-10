import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import { forwardRef, SetStateAction, useState } from 'react';

import { HoleDto } from '../../../../../../../../store/types';
import { GridHole } from '../GridHole';
import { Details } from '../Details';

interface DetailsProps {
	close: () => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OpenDetails({ close, open, setOpen }: DetailsProps) {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog
				fullScreen
				open={open}
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
					</Toolbar>
				</AppBar>
				<Details close={() => setOpen(false)} />
			</Dialog>
		</>
	);
}
