/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Checkbox, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import {
	listAllUsers,
	userList,
} from '../../../../../../store/modules/User/userAdapter';
import { useEffect } from 'react';
import { getUser } from '../../../../../../store/modules/User/userSlice';

interface ListProps {
	isChecked: boolean;
	setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const List = ({ isChecked, setIsChecked }: ListProps) => {
	const selectUser = useAppSelector(listAllUsers);

	const dispatch = useAppDispatch();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(event.target.checked);

		localStorage.clear();
	};

	useEffect(() => {
		dispatch(userList());
	}, [dispatch]);

	useEffect(() => {
		if (isChecked === true) {
			dispatch(getUser());
		}
	}, [isChecked, setIsChecked]);

	return (
		<Box
			sx={{
				width: '100%',
				background: '#fff',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			{selectUser.map(({ id, username }) => (
				<Box
					key={id}
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderBottom: '1px solid #000',
					}}
				>
					<Typography
						sx={{
							flex: 0.153,
							pl: 5,
							borderRight: '1px solid #000',
							pt: 1,
							pb: 1,
						}}
					>
						{id?.slice(0, 1)}
					</Typography>
					<Typography
						sx={{
							flex: 1,
							pl: 5,
							pt: 1,
							pb: 1,
						}}
					>
						{username}
					</Typography>
					<Checkbox checked={isChecked} onChange={handleChange} />
				</Box>
			))}
		</Box>
	);
};
