import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { IsValidCredentials, User } from '../../../../../../store/types';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { createUser } from '../../../../../../store/modules/User/userSlice';
import {
	userDelete,
	userEdit,
} from '../../../../../../store/modules/User/userAdapter';

interface FormRegisterProps {
	isChecked: boolean;
}

export const FormRegister = ({ isChecked }: FormRegisterProps) => {
	const dispatch = useAppDispatch();
	const userId = useAppSelector((state) => state.user.user.id);

	const [username, setUsername] = useState('');

	const [errorUsername, setErrorUsername] = useState<IsValidCredentials>({
		helperText: '',
		isValid: true,
	});

	const user: User = {
		username,
	};

	const handleSignupUser = (ev: React.FormEvent<HTMLFormElement>) => {
		ev.preventDefault();

		if (!ev.currentTarget.checkValidity()) {
			return;
		}

		dispatch(createUser(user));
		setTimeout(() => {
			setUsername('');
		}, 3000);
	};

	const handleEditUser = () => {
		if (userId) {
			dispatch(
				userEdit({
					id: userId,
					username: username,
				}),
			);
			setTimeout(() => {
				setUsername('');
			}, 3000);
		} else {
			console.error('ID do usuário não disponível');
		}
	};

	const handleDeleteUser = () => {
		if (userId) {
			dispatch(userDelete(userId));
			setTimeout(() => {
				setUsername('');
			}, 3000);
		} else {
			console.error('ID do usuário não disponível');
		}
	};

	useEffect(() => {
		if (username.length && username.length < 3) {
			setErrorUsername({
				helperText: 'Informe um username válido.',
				isValid: false,
			});
		} else {
			setErrorUsername({
				helperText: 'Utilize um username para criar uma conta.',
				isValid: true,
			});
		}
	}, [username]);

	useEffect(() => {
		if (isChecked) {
			setTimeout(() => {
				const usernameFromLocalStorage =
					localStorage.getItem('username');

				if (usernameFromLocalStorage) {
					setUsername(usernameFromLocalStorage);
				}
			}, 100);
		} else {
			setUsername('');
		}
	}, [isChecked]);

	return (
		<Box
			component="form"
			onSubmit={handleSignupUser}
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 4,
				background: '#fff',
				borderLeft: '1px solid #000',
				pt: 3,
			}}
		>
			<TextField
				label="Nome"
				size="small"
				error={!errorUsername.isValid}
				onChange={(event) => setUsername(event.currentTarget.value)}
				value={username}
				sx={{
					alignSelf: 'flex-start',
					ml: 7,
				}}
			/>

			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<Button color="inherit" type="submit">
					Incluir
				</Button>
				<Button color="inherit" onClick={handleEditUser}>
					Editar
				</Button>
				<Button color="inherit" onClick={handleDeleteUser}>
					Excluir
				</Button>
			</Box>
		</Box>
	);
};
