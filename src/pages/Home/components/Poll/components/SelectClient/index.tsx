import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppSelector } from '../../../../../../store/hooks';
import { listAllUsers } from '../../../../../../store/modules/User/userAdapter';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles(name: string, personName: string[], theme: Theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

interface MultipleSelectProps {
	personName: string[];
	setPersonName: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MultipleSelect({
	personName,
	setPersonName,
}: MultipleSelectProps) {
	const theme = useTheme();
	const names = useAppSelector(listAllUsers);

	const handleChange = (event: SelectChangeEvent<typeof personName>) => {
		const {
			target: { value },
		} = event;
		setPersonName(typeof value === 'string' ? value.split(',') : value);
	};

	return (
		<div>
			<FormControl sx={{ m: 1, width: 300 }} size="small">
				<InputLabel id="demo-multiple-name-label">Cliente</InputLabel>
				<Select
					labelId="demo-multiple-name-label"
					id="demo-multiple-name"
					multiple
					value={personName}
					onChange={handleChange}
					input={<OutlinedInput label="Name" />}
					MenuProps={MenuProps}
				>
					{names.map((name) => (
						<MenuItem
							key={name.username}
							value={name.username}
							style={getStyles(name.username, personName, theme)}
						>
							{names.length} - {name.username}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}
