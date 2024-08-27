import { Box, Button, Grid } from '@mui/material';

interface AppbarProps {
	handleDisplay: () => void;
	handleDisplayProjects: () => void;
}

export const Appbar = ({
	handleDisplay,
	handleDisplayProjects,
}: AppbarProps) => {
	return (
		<>
			<Box
				sx={{
					width: '100%',
					background: '#fff',
				}}
			>
				<Grid
					container
					spacing={{ xs: 2, sm: 2, md: 4 }}
					columns={{ xs: 12, sm: 12, md: 12 }}
				>
					<Grid item xs={12} sm={12} md={2}>
						<Box
							sx={{
								width: '100%',
								pt: 1,
								pb: 1,
								pl: 4,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Button
								sx={{
									color: '#000',
								}}
								onClick={handleDisplay}
							>
								Cadastro
							</Button>
							<Button
								sx={{
									color: '#000',
								}}
								onClick={handleDisplayProjects}
							>
								Sondagem
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};
