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
import OpenDetails from '../OpenDetails';

interface HoleProps {
	openHole: boolean;
	setOpenHole: React.Dispatch<React.SetStateAction<boolean>>;
	close: () => void;
	holeNumber: string;
	setHoleNumber: React.Dispatch<React.SetStateAction<string>>;
	initialDate: string;
	setInitialDate: React.Dispatch<React.SetStateAction<string>>;
	finalDate: string;
	setFinalDate: React.Dispatch<React.SetStateAction<string>>;
	name: string;
	setName: React.Dispatch<React.SetStateAction<string>>;
	workDescription: string;
	setWorkDescription: React.Dispatch<React.SetStateAction<string>>;
	quota: string;
	setQuota: React.Dispatch<React.SetStateAction<string>>;
	waterLevel: string;
	setWaterLevel: React.Dispatch<React.SetStateAction<string>>;
	interval: string;
	setInterval: React.Dispatch<React.SetStateAction<string>>;
	waterLevelTwo: string;
	setWaterLevelTwo: React.Dispatch<React.SetStateAction<string>>;
	intervalTwo: string;
	setIntervalTwo: React.Dispatch<React.SetStateAction<string>>;
	torque: string;
	setTorque: React.Dispatch<React.SetStateAction<string>>;
	coating: string;
	setCoating: React.Dispatch<React.SetStateAction<string>>;
	ultimateDigger: string;
	setUltimateDigger: React.Dispatch<React.SetStateAction<string>>;
	initialHelical: string;
	setInitialHelical: React.Dispatch<React.SetStateAction<string>>;
	finalHelical: string;
	setFinalHelical: React.Dispatch<React.SetStateAction<string>>;
	printSpt: string;
	setPrintSpt: React.Dispatch<React.SetStateAction<string>>;
	stop: string;
	setStop: React.Dispatch<React.SetStateAction<string>>;
	textPoll: string;
	setTextPoll: React.Dispatch<React.SetStateAction<string>>;
	prober: string;
	setProber: React.Dispatch<React.SetStateAction<string>>;
	pageLines: string;
	setPageLines: React.Dispatch<React.SetStateAction<string>>;
}

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Hole({
	openHole,
	setOpenHole,
	close,
	holeNumber,
	setHoleNumber,
	initialDate,
	setInitialDate,
	finalDate,
	setFinalDate,
	name,
	setName,
	workDescription,
	setWorkDescription,
	quota,
	setQuota,
	waterLevel,
	setWaterLevel,
	interval,
	setInterval,
	waterLevelTwo,
	setWaterLevelTwo,
	intervalTwo,
	setIntervalTwo,
	torque,
	setTorque,
	coating,
	setCoating,
	ultimateDigger,
	setUltimateDigger,
	initialHelical,
	setInitialHelical,
	finalHelical,
	setFinalHelical,
	printSpt,
	setPrintSpt,
	stop,
	setStop,
	textPoll,
	setTextPoll,
	prober,
	setProber,
	pageLines,
	setPageLines,
}: HoleProps) {
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpenHole(false);
	};

	return (
		<>
			<Dialog
				fullScreen
				open={openHole}
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
							Manutenção Dados Furo
						</Typography>
						<Button onClick={() => setOpen(true)}>
							<Typography
								sx={{
									color: '#FFF',
								}}
							>
								Outros Detalhes
							</Typography>
						</Button>
					</Toolbar>
				</AppBar>
				<GridHole
					close={() => setOpenHole(false)}
					holeNumber={holeNumber}
					setHoleNumber={setHoleNumber}
					initialDate={initialDate}
					setInitialDate={setInitialDate}
					finalDate={finalDate}
					setFinalDate={setFinalDate}
					name={name}
					setName={setName}
					workDescription={workDescription}
					setWorkDescription={setWorkDescription}
					quota={quota}
					setQuota={setQuota}
					waterLevel={waterLevel}
					setWaterLevel={setWaterLevel}
					interval={interval}
					setInterval={setInterval}
					waterLevelTwo={waterLevelTwo}
					setWaterLevelTwo={setWaterLevelTwo}
					intervalTwo={intervalTwo}
					setIntervalTwo={setIntervalTwo}
					torque={torque}
					setTorque={setTorque}
					coating={coating}
					setCoating={setCoating}
					ultimateDigger={ultimateDigger}
					setUltimateDigger={setUltimateDigger}
					initialHelical={initialHelical}
					setInitialHelical={setInitialHelical}
					finalHelical={finalHelical}
					setFinalHelical={setFinalHelical}
					printSpt={printSpt}
					setPrintSpt={setPrintSpt}
					stop={stop}
					setStop={setStop}
					textPoll={textPoll}
					setTextPoll={setTextPoll}
					prober={prober}
					setProber={setProber}
					pageLines={pageLines}
					setPageLines={setPageLines}
				/>
			</Dialog>
			<OpenDetails close={handleClose} open={open} setOpen={setOpen} />
		</>
	);
}
