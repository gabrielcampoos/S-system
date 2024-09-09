import React, { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../../../store';
import { updateLayerImage } from '../../../../../../../../store/modules/Data/dataSlice';

// Função auxiliar para converter BMP para PNG
const convertBMPtoPNG = (bmpDataUrl: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = bmpDataUrl;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (ctx) {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				const pngDataUrl = canvas.toDataURL('image/png');
				resolve(pngDataUrl);
			} else {
				reject('Failed to get canvas context');
			}
		};
		img.onerror = () => reject('Failed to load image');
	});
};

interface FileUploadProps {
	layerIndex: number;
	hatch: string;
	setHatch: React.Dispatch<React.SetStateAction<string>>;
}

const FileUpload: React.FC<FileUploadProps> = ({
	layerIndex,
	hatch,
	setHatch,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const result = reader.result;
				if (typeof result === 'string') {
					try {
						// Convert BMP to PNG
						const pngDataUrl = await convertBMPtoPNG(result);
						// Dispatch the updated image to Redux
						dispatch(
							updateLayerImage({
								index: layerIndex,
								image: pngDataUrl,
							}),
						);
						setHatch(pngDataUrl);
					} catch (error) {
						console.error('Error converting BMP to PNG:', error);
					}
				} else {
					console.error('Error reading file: result is not a string');
				}
			};
			reader.readAsDataURL(file);
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
				accept=".bmp"
			/>
			<IconButton onClick={handleButtonClick}>
				<CreateNewFolderIcon fontSize="large" />
			</IconButton>
		</Box>
	);
};

export default FileUpload;
