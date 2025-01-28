/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Checkbox, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import {
	listAllUsers,
	userList,
} from '../../../../../../store/modules/User/userAdapter';
import { useEffect, useState } from 'react';
import { getUser } from '../../../../../../store/modules/User/userSlice';

interface ListProps {
	isChecked: boolean;
	setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const List = ({ isChecked, setIsChecked }: ListProps) => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	// Seleciona os usuários do Redux
	const selectUser = useAppSelector(listAllUsers);

	const dispatch = useAppDispatch();

	// Gerencia a seleção do usuário pelo ID
	const handleChange =
		(id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const checked = event.target.checked;

			if (checked) {
				setSelectedUserId(id);
			} else {
				setSelectedUserId(null);
			}
		};

	// Faz o dispatch para listar os usuários ao montar o componente
	useEffect(() => {
		dispatch(userList());
	}, [dispatch]);

	// Carrega o usuário selecionado
	useEffect(() => {
		if (selectedUserId) {
			dispatch(getUser(selectedUserId));
		}
	}, [selectedUserId, dispatch]);

	// Ordena os usuários por createdAt (mais recente para mais antigo)
	const orderedUsers = [...selectUser].sort(
		(a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);

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
			{orderedUsers.map((user, index) => (
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
					{/* Índice do usuário */}
					<Typography
						sx={{
							flex: 0.16,
							pl: 5,
							borderRight: '1px solid #000',
							pt: 1,
							pb: 1,
						}}
					>
						{index + 1}
					</Typography>

					{/* Nome do usuário */}
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

					{/* Checkbox de seleção */}
					<Checkbox
						checked={selectedUserId === user.id}
						onChange={handleChange(user.id)}
					/>
				</Box>
			))}
		</Box>
	);
};
