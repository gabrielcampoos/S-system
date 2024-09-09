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
import { GridLayerHole } from '../GridLayerHole';

interface LayerHoleProps {
	openLayerHole: boolean;
	setOpenLayerHole: React.Dispatch<React.SetStateAction<boolean>>;
	hatch: string;
	setHatch: React.Dispatch<React.SetStateAction<string>>;
}

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function LayerHole({
	openLayerHole,
	setOpenLayerHole,
	hatch,
	setHatch,
}: LayerHoleProps) {
	const [layerIndex, setLayerIndex] = React.useState<number>(0);

	const handleClose = () => {
		setOpenLayerHole(false);
	};

	return (
		<React.Fragment>
			<Dialog
				fullScreen
				open={openLayerHole}
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
							Camadas do Furo
						</Typography>
					</Toolbar>
				</AppBar>
				<GridLayerHole
					closeLayerHole={handleClose}
					layerIndex={layerIndex}
					setLayerIndex={setLayerIndex}
					hatch={hatch}
					setHatch={setHatch}
				/>
			</Dialog>
		</React.Fragment>
	);
}
