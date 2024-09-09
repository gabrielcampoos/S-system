import { Box, Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import FileUpload from '../FileUpload';
import {
	useAppDispatch,
	useAppSelector,
} from '../../../../../../../../store/hooks';
import { createLayer } from '../../../../../../../../store/modules/Layer/layerSlice';
import { LayerDto } from '../../../../../../../../store/types';

interface GridLayerHoleProps {
	closeLayerHole: () => void;
	layerIndex: number;
	setLayerIndex: React.Dispatch<React.SetStateAction<number>>;
	hatch: string;
	setHatch: React.Dispatch<React.SetStateAction<string>>;
}

export const GridLayerHole = ({
	closeLayerHole,
	layerIndex,
	setLayerIndex,
}: GridLayerHoleProps) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [furValue, setFurValue] = useState<string>('');
	const [typeValue, setTypeValue] = useState<string>('');
	const [descriptionValue, setDescriptionValue] = useState<string>('');
	const [layerValue, setLayerValue] = useState<string>('');
	const [values, setValues] = useState<string[]>([]);
	const [types, setTypes] = useState<string[]>([]);
	const [description, setDescription] = useState<string[]>([]);
	const [layer, setLayer] = useState<string[]>([]);
	const [name, setName] = useState('');
	const [depth, setDepth] = useState(0);
	const [hatch, setHatch] = useState(''); // Adicionando o estado para hatch
	const [listImages, setListImages] = useState(['']);
	const list = [''];

	const dispatch = useAppDispatch();

	const holeValues = useAppSelector((state) => state.holeReducer.entities);
	const projectValues = useAppSelector((state) =>
		state.user.projects.find(
			(project) => project.id === localStorage.getItem('idProject'),
		),
	);
	const layerLength = useAppSelector((state) => state.layer.ids);

	// Função para atualizar localStorage e estado
	const updateStateAndLocalStorage = (
		key: string,
		updatedArray: string[],
	) => {
		localStorage.setItem(key, JSON.stringify(updatedArray));
		if (key === 'types') setTypes(updatedArray);
		if (key === 'description') setDescription(updatedArray);
		if (key === 'layer') setLayer(updatedArray);
	};

	useEffect(() => {
		const loadLocalStorage = (
			key: string,
			setState: (data: string[]) => void,
		) => {
			const storedData = localStorage.getItem(key);
			if (storedData) {
				const parsedData = JSON.parse(storedData);
				console.log(`Loaded ${key}:`, parsedData); // Verifique o conteúdo carregado
				setState(parsedData);
			}
		};

		// Função para carregar dados do localStorage
		// Acesse o ID do furo armazenado no localStorage
		const idHole = localStorage.getItem('idHole');

		// Verifique se holeValues e idHole são válidos
		if (holeValues && idHole && typeof holeValues === 'object') {
			// Encontre o furo pelo ID
			const hole = holeValues[idHole];
			if (hole) {
				setName(hole.name); // Atualize o estado com o nome do furo
			} else {
				console.log('No matching hole found');
			}
		}

		// const loadLocalStorage = (
		// 	key: string,
		// 	setState: (data: string[]) => void,
		// ) => {
		// 	const storedData = localStorage.getItem(key);
		// 	if (storedData) setState(JSON.parse(storedData));
		// };

		// Carregar todos os dados necessários
		loadLocalStorage('names', (parsedValues) => {
			setValues(parsedValues);
			if (parsedValues.length > 0) {
				const lastIndex = parsedValues.length - 1;
				setCurrentIndex(lastIndex);
				setFurValue(parsedValues[lastIndex]);
			}
		});
		loadLocalStorage('types', setTypes);
		loadLocalStorage('description', setDescription);
		loadLocalStorage('layer', setLayer);
	}, []);

	useEffect(() => {
		// Atualizar descriptionValue com base no typeValue
		const descriptions: Record<string, string> = {
			'1': 'AREIA FINA',
			'2': 'SILTE',
			'3': 'ARGILA',
			'4': 'ROCHA',
			'11': 'AREIA FINA ARENOSA',
			'12': 'AREIA FINA SILTOSA',
			'13': 'AREIA FINA ARGILOSA',
			'21': 'SILTE ARENOSO',
			'22': 'SILTE SILTOSO',
			'23': 'SILTE ARGILOSO',
			'31': 'ARGILA ARENOSA',
			'32': 'ARGILA SILTOSA',
			'33': 'ARGILA ARGILOSA',
		};

		setDescriptionValue(descriptions[typeValue] || 'Descrição');
	}, [typeValue]);

	const handleConfirm = async () => {
		try {
			// Validar dados
			const projectNumber = Number(projectValues?.projectNumber);
			const holeId = localStorage.getItem('idHole');
			console.log(projectNumber);

			if (!holeId) {
				throw new Error('ID do furo não encontrado no localStorage.');
			}

			if (!typeValue || !descriptionValue || !hatch) {
				throw new Error('Um ou mais campos estão vazios.');
			}

			// Cria uma lista com um único objeto
			const layerState = {
				projectNumber,
				hole: name,
				code: layerLength.length + 1,
				depth: depth,
				profundities: [], // Corrija o nome se necessário
				type: typeValue,
				description: descriptionValue,
				hatch: hatch,
			};

			console.log(layerState);

			// Enviar requisição com a lista
			const response = await dispatch(
				createLayer({
					holeId,
					data: layerState, // Envia a lista de objetos
				}),
			).unwrap();

			list.push(...hatch);

			console.log('Resposta da API:', response);
			setLayerIndex(layerLength.length); // Exemplo de definição do layerIndex
			setLayer(list);
			closeLayerHole();
		} catch (error: any) {
			console.error(
				'Erro ao confirmar a criação da camada:',
				error.response ? error.response.data : error.message,
			);
		}
	};

	const handleChange = (
		ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const value = ev.currentTarget.value;

		const parsedValue = parseFloat(value);

		if (!isNaN(parsedValue)) {
			setDepth(parsedValue);
		} else {
			// Se precisar, defina um valor padrão ou manipule a entrada inválida
			setDepth(0); // Valor padrão em caso de entrada inválida
		}
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
						sx={{
							flex: 0.1,
							m: 2,
						}}
						value={projectValues?.projectNumber}
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
						sx={{
							flex: 0.1,
							m: 2,
						}}
						value={name}
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
						sx={{
							flex: 0.1,
							m: 2,
						}}
						value={layerLength.length + 1}
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
						onChange={handleChange}
						value={depth}
						type="number"
						inputProps={{ step: '0.01' }}
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

				<Grid item xs={12} sm={12} md={12}>
					<TextField
						label={descriptionValue}
						size="small"
						value={descriptionValue}
						onChange={(e) => setDescriptionValue(e.target.value)}
						sx={{ flex: 1, m: 2 }}
					/>
				</Grid>

				<Grid item xs={12} sm={12} md={12}>
					<TextField
						label="Hachura"
						size="small"
						value={hatch}
						onChange={(e) => setHatch(e.target.value)}
						sx={{ flex: 1, m: 2 }}
					/>
					<FileUpload
						layerIndex={layerIndex}
						hatch={hatch}
						setHatch={setHatch}
					/>
				</Grid>

				<Grid item xs={12} sm={12} md={12}>
					<Button onClick={handleConfirm}>Confirmar</Button>
					<Button onClick={closeLayerHole}>Cancelar</Button>
				</Grid>
			</Grid>
		</Box>
	);
};
