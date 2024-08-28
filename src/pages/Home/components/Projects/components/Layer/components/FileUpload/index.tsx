import React, { useRef } from 'react';
import { Button, Typography, Box, IconButton } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

interface FileUploadProps {
	hatch: string;
	setHatch: React.Dispatch<React.SetStateAction<string>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ hatch, setHatch }) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setHatch(file.name);

			localStorage.setItem('hatch', JSON.stringify(file.name));
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 2,
			}}
		>
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
				// accept=".rar, .bmp"
			/>
			<IconButton onClick={handleButtonClick}>
				<CreateNewFolderIcon fontSize="large" />
			</IconButton>
		</Box>
	);
};

export default FileUpload;
