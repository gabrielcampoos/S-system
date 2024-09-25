/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Checkbox, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import {
	listAllUsers,
	userList,
} from '../../../../../../store/modules/User/userAdapter';
import { useEffect, useState } from 'react';
import { getUser } from '../../../../../../store/modules/User/userSlice';
import { listProjects } from '../../../../../../store/modules/Project/projectSlice';

interface ListProps {
	isChecked: boolean;
	setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const List = ({ isChecked, setIsChecked }: ListProps) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const selectUser = useAppSelector(listAllUsers);

	const dispatch = useAppDispatch();

	const handleChange =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const checked = event.target.checked;

			if (checked) {
				setSelectedUserId(id);
			} else {
				setSelectedUserId(null);
			}
		};

	useEffect(() => {
		dispatch(userList());
	}, [dispatch]);

	useEffect(() => {
		if (selectedUserId) {
			dispatch(getUser(selectedUserId));
		}
	}, [selectedUserId, dispatch]);

	return (
		<Box
			sx={{
				width: '100%',
				background: '#fff',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				borderLeft: '1px solid #000',
			}}
		>
			{selectUser.map((user) => (
				<Box
					key={user.id}
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
							flex: 0.16,
							pl: 5,
							borderRight: '1px solid #000',
							pt: 1,
							pb: 1,
						}}
					>
						{user.id?.slice(0, 1)}
					</Typography>
					<Typography
						sx={{
							flex: 1,
							pl: 5,
							pt: 1,
							pb: 1,
						}}
					>
						{user.username}
					</Typography>
					<Checkbox
						checked={selectedUserId === user.id}
						onChange={handleChange(user.id)}
					/>
				</Box>
			))}
		</Box>
	);
};
