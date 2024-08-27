import { Box } from '@mui/material';
import { Appbar } from './components/Appbar';

import { useState } from 'react';
import { Poll } from './components/Poll';
import { Projects } from './components/Projects';
import Register from './components/Register';

export const Home = () => {
	const [display, setDisplay] = useState('none');
	const [displayProjects, setDisplayProjects] = useState('none');

	function handleDisplay() {
		display === 'none' ? setDisplay('visible') : setDisplay('none');
	}

	function handleDisplayProjects() {
		displayProjects === 'none'
			? setDisplayProjects('visible')
			: setDisplayProjects('none');
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100vh',
				background: '#29397E',
			}}
		>
			<Appbar
				handleDisplay={handleDisplay}
				handleDisplayProjects={handleDisplayProjects}
			/>

			<Box
				display={display}
				sx={{
					width: '100%',
				}}
			>
				<Register />
			</Box>
			<Box
				display={displayProjects}
				sx={{
					width: '100%',
				}}
			>
				<Projects />
			</Box>
		</Box>
	);
};
