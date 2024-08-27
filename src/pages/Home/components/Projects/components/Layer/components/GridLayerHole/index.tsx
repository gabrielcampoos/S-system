import { Box, Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../../../../store/hooks';

interface GridLayerHoleProps {
	closeLayerHole: () => void;
}

export const GridLayerHole = ({ closeLayerHole }: GridLayerHoleProps) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [furValue, setFurValue] = useState<string>('');
	const [typeValue, setTypeValue] = useState<string>('');
	const [hatchValue, setHatchValue] = useState<string>('');
	const [descriptionValue, setDescriptionValue] = useState<string>('');
	const [layerValue, setLayerValue] = useState<string>('');
	const [values, setValues] = useState<string[]>([]);
	const [types, setTypes] = useState<string[]>([]);
	const [hatch, setHatch] = useState<string[]>([]);
	const [description, setDescription] = useState<string[]>([]);
	const [layer, setLayer] = useState<string[]>([]);

	useEffect(() => {
		const storedValues = localStorage.getItem('names');
		if (storedValues) {
			const parsedValues = JSON.parse(storedValues);
			setValues(parsedValues);
			if (parsedValues.length > 0) {
				const lastIndex = parsedValues.length - 1;
				setCurrentIndex(lastIndex);
				setFurValue(parsedValues[lastIndex]);
			}
		}

		const storedTypes = localStorage.getItem('types');
		if (storedTypes) {
			const parsedTypes = JSON.parse(storedTypes);
			setTypes(parsedTypes);
		}

		const storedHatch = localStorage.getItem('hatch');
		if (storedHatch) {
			const parsedHatch = JSON.parse(storedHatch);
			setHatchValue(parsedHatch);
		}

		const storedDescription = localStorage.getItem('description');
		if (storedDescription) {
			const parsedDescription = JSON.parse(storedDescription);
			setDescriptionValue(parsedDescription);
		}

		const storedLayer = localStorage.getItem('layer');
		if (storedLayer) {
			const parsedLayer = JSON.parse(storedLayer);
			setLayerValue(parsedLayer);
		}
	}, []);

	const handleConfirm = () => {
		const updatedTypes = [...types];
		updatedTypes[currentIndex] = typeValue;

		setTypes(updatedTypes);
		localStorage.setItem('types', JSON.stringify(updatedTypes));

		const updatedHatch = [...hatch];
		if (currentIndex < updatedHatch.length) {
			updatedHatch[currentIndex] = hatchValue;
		} else {
			updatedHatch.push(hatchValue);
		}
		setHatch(updatedHatch);
		localStorage.setItem('hatch', JSON.stringify(updatedHatch));

		const updatedDescription = [...description];
		if (currentIndex < updatedDescription.length) {
			updatedDescription[currentIndex] = descriptionValue;
		} else {
			updatedDescription.push(descriptionValue);
		}
		setDescription(updatedDescription);
		localStorage.setItem('description', JSON.stringify(updatedDescription));

		const updatedLayer = [...layer];
		if (currentIndex < updatedLayer.length) {
			updatedLayer[currentIndex] = layerValue;
		} else {
			updatedLayer.push(layerValue);
		}
		setLayer(updatedLayer);
		localStorage.setItem('layer', JSON.stringify(updatedLayer));
	};
	return (
		<Box
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
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Projeto"
						size="small"
						type="number"
						sx={{
							flex: 0.1,
							m: 2,
						}}
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
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Furo"
						size="small"
						value={furValue}
						onChange={(e) => setFurValue(e.target.value)}
						sx={{
							flex: 0.1,
							m: 2,
						}}
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
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Código"
						size="small"
						type="number"
						sx={{
							flex: 0.1,
							m: 2,
						}}
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
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Profundidade"
						size="small"
						sx={{
							flex: 0.1,
							m: 2,
						}}
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
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					<TextField
						label="Tipo (1 - Areia / 2 - Silte / 3 - Argila / 4 - Rocha / 5 - Outros"
						size="small"
						sx={{
							flex: 0.3,
							m: 2,
						}}
						value={typeValue}
						onChange={(e) => setTypeValue(e.target.value)}
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
						label="Descrição"
						size="small"
						sx={{
							flex: 1,
							m: 2,
						}}
						value={descriptionValue}
						onChange={(e) => setDescriptionValue(e.target.value)}
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
						label="Hachura"
						size="small"
						sx={{
							flex: 1,
							m: 2,
						}}
						value={hatchValue}
						onChange={(e) => setHatchValue(e.target.value)}
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
						justifyContent: 'space-around',
						alignItems: 'center',
						mt: 5,
					}}
				>
					<Button onClick={handleConfirm}>Confirmar</Button>
					<Button onClick={closeLayerHole}>Cancelar</Button>
				</Grid>
			</Grid>
		</Box>
	);
};
