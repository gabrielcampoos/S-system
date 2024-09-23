import jsPDF from 'jspdf';

interface GeneratePDFProps {
	data: {
		username: string;
		obra: string;
		local: string;
		furo: string;
		intervalo: string;
		intervalo2: string;
		espiral: string;
		espiralFinal: string;
		cota: number;
		dataInicio: string;
		dataFinal: string;
		profundidadeCamada: number[];
		profundities: {
			id?: string;
			profundity0?: number;
			spt?: number;
			hit1?: number;
			hit2?: number;
			hit3?: number;
			profundity1?: number;
			profundity2?: number;
			profundity3?: number;
		}[];
		layer: {
			description: string;
			depth: number;
			classLayer: string;
			hit1: number;
			hit2: number;
			hit3: number;
			hitDepth1: number;
			hitDepth2: number;
			hitDepth3: number;
			backgroundImage: string;
		}[];
		footer: string;
		na: string;
		waterLevel: string;
		waterLevelTwo: string;
		printSpt: string;
	};
}

const generatePDF = ({ data }: GeneratePDFProps) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.width; // Largura total da página
	const pageHeight = doc.internal.pageSize.height; // Altura total da página
	const marginLeft = 1; // Margem esquerda
	const marginRight = 1; // Margem direita
	const textRightX = pageWidth - marginRight; // Posição X para o texto à direita
	const separatorX = textRightX - 65; // Posição X para o separador vertical, ajustado próximo aos textos da direita
	const lineSpacing = 5; // Espaçamento entre linhas ajustado
	const rulerSpacing = 12; // Espaçamento entre as linhas da régua
	const rulerStartX = marginLeft + 15; // Posição X inicial da régua (linha vertical)
	const shortLineLength = 5; // Comprimento das linhas curtas
	const mediumLineLength = 10; // Comprimento das linhas médias
	const longLineLength = 15; // Comprimento das linhas longas
	const cotaInitial = data.cota; // Cota inicial passada nos dados
	const markPositions: any = [];
	const initialX = 148; // Espaçamento entre as colunas no eixo X
	const startY = 50; // Posição Y inicial
	let previousClassLayer = ''; // Variável para armazenar o classLayer da camada anterior
	let previousYPositionGlobal = 0; // Variável para armazenar a posição Y do texto da camada anterior
	let lineOffImages = 0;
	let page = 1;

	// Variáveis para armazenar os valores finais
	let finalDepthPageOne: number = 0;
	let finalDepth: number = 0;
	let finalDescriptionPageOne = '';
	let finalDescription = '';
	let secondLastRenderedDepth = null; // Penúltima profundidade renderizada
	let secondLastRenderedDescription = null; // Penúltima descrição renderizada
	let finalHit1: any = null;
	let finalHit2: any = null;
	let finalHit3: any = null;
	let finalProfundity1: any = null;
	let finalProfundity2: any = null;
	let finalProfundity3: any = null;
	let finalMarkPositions: any[] = [];
	const listDescriptions: any[] = [];
	const listDescriptionsForPageTwo: any[] = [];
	const listHits: any[] = [];
	const listSoilText: any[] = [];
	let prevYPosition: number = 0;
	let cotaFinal: number = 0;
	let finalDepthForPageTwo = 0;
	const listDepthPageTwo: number[] = [];

	// FUNÇÃO PARA DESENHAR A PRIMEIRA PÁGINA
	const drawPageOne = (data: any) => {
		drawHeader(data);

		drawRuler(cotaInitial);

		drawLayerDescriptions(
			doc,
			data,
			rulerStartX,
			rulerSpacing,
			pageHeight,
			startY,
		);

		drawProfundities();

		drawLinesProfundities();

		checkSoilDescriptionAndDrawText(
			doc,
			data,
			rulerStartX,
			rulerSpacing,
			startY,
			listHits,
		);

		drawHatch();
	};

	const drawPageTwo = (data: any) => {
		doc.addPage();

		drawHeader(data);

		drawRuler(cotaFinal);

		drawLayerDescriptionsForPageTwo(
			doc,
			rulerStartX,
			rulerSpacing,
			pageHeight,
			startY,
			listDescriptionsForPageTwo,
			listDepthPageTwo,
			finalDepthForPageTwo,
		);

		drawProfunditiesForPageTwo(finalDepthForPageTwo);

		drawLinesProfunditiesPageTwo(
			doc,
			rulerStartX,
			rulerSpacing,
			pageHeight,
			pageWidth,
			startY, // início da segunda página
			finalDepthForPageTwo, // última profundidade da página 1
			listDepthPageTwo, // profundidades da página 2
		);

		checkSoilDescriptionAndDrawTextForPageTwo(
			doc,
			data,
			rulerStartX,
			rulerSpacing,
			startY,
			listHits,
			finalDepthForPageTwo,
		);

		drawHatchForPageTwo(
			doc,
			data,
			marginLeft,
			rulerSpacing,
			startY,
			finalDepthForPageTwo,
		);
	};

	// CHAMANDO A FUNÇÃO PARA DESENHAR A PRIMEIRA PÁGINA
	drawPageOne(data);

	drawPageTwo(data);

	// FUNÇÃO PARA DESENHAR CABEÇALHO
	function drawHeader(data: any) {
		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');
		const lineYPosition = 50; // Ajuste a posição Y conforme necessário

		// Definir posição Y inicial para o texto à esquerda
		let yPosition = 5; // Posição Y inicial sem margem

		// Desenhar o texto à esquerda
		doc.text(`Cliente: `, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text(`${data.username}`, marginLeft + 13, yPosition);
		yPosition += lineSpacing;

		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');
		doc.text(`Obra: `, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.text(`${data.obra} `, marginLeft + 13, yPosition);
		yPosition += lineSpacing;

		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');
		doc.text(`Local:`, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.text(` ${data.local}`, marginLeft + 12, yPosition);
		yPosition += lineSpacing;

		// Desenhar separador vertical à direita
		doc.setDrawColor('#000');
		doc.setLineWidth(0.2);

		doc.line(separatorX, 0, separatorX, pageHeight); // Linha vertical da parte superior até a parte inferior da página

		// Ajustar a posição Y inicial para os textos à direita, começando ao lado do separador
		let rightYPosition = 5; // Começar alinhado com o topo do primeiro texto à esquerda

		// Texto à direita
		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text('SONDAGEM A PERCUSSÃO', separatorX + 2, rightYPosition, {
			align: 'left',
		});
		rightYPosition += lineSpacing;

		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text(data.furo.toUpperCase(), separatorX + 2, rightYPosition, {
			align: 'left',
		});
		rightYPosition += lineSpacing;

		doc.setFont('Times New Roman', 'bold');
		doc.text(`COTA ${data.cota}0`, separatorX + 2, rightYPosition, {
			align: 'left',
		});
		rightYPosition += lineSpacing;

		doc.setFontSize(8); // Menor tamanho da fonte para datas
		doc.setFont('Times New Roman', 'normal');

		const dataInicio = new Date(data.dataInicio).toLocaleDateString(
			'pt-BR',
		);
		const dataFinal = new Date(data.dataFinal).toLocaleDateString('pt-BR');

		const dateText = `Data de início: ${dataInicio}  Término: ${dataFinal}`;
		doc.text(dateText, separatorX + 2, rightYPosition, { align: 'left' });
		rightYPosition += lineSpacing;

		// Desenhar linha vertical da base dos textos até a parte inferior da página
		doc.setLineWidth(0.2);

		doc.line(
			separatorX,
			rightYPosition - lineSpacing,
			separatorX,
			pageHeight,
		); // Linha vertical da base dos textos até o fundo da página

		// Desenhar linha vertical à esquerda
		doc.setLineWidth(0.2);
		doc.line(marginLeft + 15, 22, marginLeft + 15, pageHeight); // Linha vertical da parte superior até a parte inferior da página

		doc.line(
			marginLeft,
			lineYPosition - 28,
			pageWidth - marginRight,
			lineYPosition - 28,
		); // Linha horizontal da margem esquerda até a margem direita

		doc.line(marginLeft + 15, 22, marginLeft + 15, 22);
		doc.text('COTA (m)', marginLeft, 35);

		// Adicionar linha horizontal na posição indicada
		doc.setLineWidth(0.2);
		doc.line(
			marginLeft + 15,
			lineYPosition,
			pageWidth - marginRight,
			lineYPosition,
		); // Linha horizontal da margem esquerda até a margem direita

		// Desenhar coluna perfil geológico
		doc.line(marginLeft + 35, 22, marginLeft + 35, pageHeight);
		doc.text('PERFIL', marginLeft + 19, 35);
		doc.text('GEOLÓGICO', marginLeft + 16, 39);

		//Desenhar coluna profundidade camada
		doc.line(marginLeft + 55, 22, marginLeft + 55, pageHeight);
		doc.text('PROFUNDI-', marginLeft + 37, 35);
		doc.text('DADE', marginLeft + 37, 39);
		doc.text('CAMADA (m)', marginLeft + 37, 43);

		//Desenhar coluna classificação da camada
		doc.line(marginLeft + 125, 22, marginLeft + 125, pageHeight);
		doc.text('AMOSTRADOR:', marginLeft + 60, 26);
		doc.text('TERZA GHI & PECK ', marginLeft + 82, 26);

		doc.text('Ø INTERNO:', marginLeft + 60, 30);
		doc.text('34,9 mm', marginLeft + 78, 30);

		doc.text('Ø EXTERNO:', marginLeft + 60, 34);
		doc.text('50,8 mm', marginLeft + 78, 34);

		doc.text('REVESTIMENTO:', marginLeft + 60, 38);
		doc.text('63,5 mm', marginLeft + 84, 38);

		doc.text('PESO:', marginLeft + 95, 30);
		doc.text('65 kg', marginLeft + 105, 30);

		doc.text('ALTURA QUEDA:', marginLeft + 92, 34);
		doc.text('75 cm', marginLeft + 115, 34);

		doc.line(marginLeft + 55, 39, marginLeft + 125, 39);
		doc.setFontSize(10);
		doc.setFont('Times New Roman', 'bold');
		doc.text('CLASSIFICAÇÃO DA CAMADA', marginLeft + 59, 45);

		//Desenhar coluna consistência ou compacidade
		doc.setFontSize(8); // Menor tamanho da fonte para datas
		doc.setFont('Times New Roman', 'normal');
		doc.text('CONSIS-', marginLeft + 128, 28);
		doc.text('TÊNCIA', marginLeft + 128, 32);
		doc.text('E', marginLeft + 132, 36);
		doc.text('COMPA-', marginLeft + 128, 40);
		doc.text('CIDADE', marginLeft + 128, 44);

		//Desenhar coluna número de golpes
		doc.line(marginLeft + 165, 22, marginLeft + 165, pageHeight);
		doc.text('NÚMERO DE', marginLeft + 145, 35);
		doc.text('GOLPES', marginLeft + 145, 39);

		//Desenhar coluna resistência a penetração
		doc.setLineWidth(0.1);
		doc.setDrawColor(150, 150, 150);
		doc.line(marginLeft + 168, 50, marginLeft + 168, pageHeight);

		const step = 12; // Altura de 1 metro em mm (ajuste conforme necessário)

		// Agora desenha os retângulos que marcam metro por metro
		let currentY = 50; // Posição inicial
		let isBlue = false; // Alterna entre branco e azul

		while (currentY < pageHeight) {
			if (isBlue) {
				// Retângulo azul
				doc.setFillColor(0, 0, 255); // Cor azul
			} else {
				// Retângulo branco
				doc.setFillColor(255, 255, 255); // Cor branca
			}

			// Desenha o retângulo verticalmente (uma coluna)
			doc.rect(marginLeft + 165, currentY, 2.8, step, 'F'); // Retângulo entre as linhas de 10 e 20 mm

			// Atualiza a posição Y para o próximo metro
			currentY += step;
			isBlue = !isBlue; // Alterna a cor para o próximo metro
		}

		doc.setDrawColor(150, 150, 150);
		doc.line(marginLeft + 165, 50, marginLeft + 171, pageHeight);
		doc.line(marginLeft + 171, 50, marginLeft + 171, pageHeight);
		doc.line(marginLeft + 174, 50, marginLeft + 174, pageHeight);
		doc.line(marginLeft + 177, 50, marginLeft + 177, pageHeight);
		doc.line(marginLeft + 180, 50, marginLeft + 180, pageHeight);
		doc.line(marginLeft + 183, 50, marginLeft + 183, pageHeight);
		doc.line(marginLeft + 186, 50, marginLeft + 186, pageHeight);
		doc.line(marginLeft + 189, 50, marginLeft + 189, pageHeight);
		doc.line(marginLeft + 192, 50, marginLeft + 192, pageHeight);
		doc.line(marginLeft + 195, 50, marginLeft + 195, pageHeight);
		doc.line(marginLeft + 198, 22, marginLeft + 198, pageHeight);
		doc.setDrawColor(0, 0, 0);

		doc.text('RESISTÊNCIA A', marginLeft + 170, 26);
		doc.text('PENETRAÇÃO', marginLeft + 170, 30);
		doc.line(marginLeft + 165, 32, marginLeft + 197, 32);

		doc.text('AMOSTRADOR TIPO', marginLeft + 167, 35);
		doc.text('TERZAGHI & PECK', marginLeft + 167, 39);
		doc.line(marginLeft + 165, 40, marginLeft + 197, 40);

		doc.text('S.P.T', marginLeft + 178, 44);
		doc.line(marginLeft + 165, 45, marginLeft + 197, 45);

		doc.text('10 20 30 40', marginLeft + 173, 49);

		//Desenhar coluna N.A
		doc.text('N.A.', marginLeft + 201, 36);
	}

	//FUNÇÃO PARA DESENHAR RÉGUA
	function drawRuler(cotaInitial: number) {
		doc.setLineWidth(0.2);
		doc.setFontSize(8);

		let rulerYPosition = 50;

		// Desenhar a régua
		for (let i = 0; rulerYPosition < pageHeight; i++) {
			let lineLength = 0;
			let cotaText = '';

			if (i === 0 || i % 5 === 0) {
				lineLength = longLineLength;
				cotaText = (cotaInitial - 5 * (i / 5)).toFixed(2);
				doc.text(cotaText, rulerStartX - 13, rulerYPosition - 2);
			} else if (i % 1 === 0) {
				lineLength = shortLineLength;
			} else {
				lineLength = mediumLineLength;
			}

			doc.line(
				rulerStartX - lineLength,
				rulerYPosition,
				rulerStartX,
				rulerYPosition,
			);

			rulerYPosition += rulerSpacing;
			cotaFinal = Number(cotaText);
		}
	}

	//FUNÇÃO PARA DESENHAR AS DESCRIÇÕES
	function drawLayerDescriptions(
		pdf: any,
		data: any,
		rulerStartX: number,
		rulerSpacing: number,
		pageHeight: number,
		startY: number,
	) {
		const layers = data.layer.sort((a: any, b: any) => a.depth - b.depth);
		const maxLineLength = 39;
		const lineHeight = 5;
		pdf.setFontSize(8);
		const pageMargin = 20;
		const currentYPosition = startY;

		layers.forEach((layer: any, index: number) => {
			const { depth, description } = layer;
			const prevDepth = index === 0 ? 0 : layers[index - 1].depth;
			const currentDepth = depth;
			const yPosition =
				currentYPosition +
				((prevDepth + currentDepth) / 2) * rulerSpacing;

			if (listDescriptions.length <= 7) {
				listDescriptions.push(description);
				finalDepthForPageTwo = depth;
			} else {
				listDescriptionsForPageTwo.push(description);
				listDepthPageTwo.push(depth);
			}

			if (yPosition >= 0 && yPosition <= pageHeight - pageMargin) {
				const textLines = description.match(
					new RegExp('.{1,' + maxLineLength + '}', 'g'),
				);

				if (textLines) {
					const textHeightApprox = lineHeight * textLines.length;
					const yCenteredPosition = yPosition - textHeightApprox / 2;

					pdf.setFillColor(255, 255, 255); // Cor branca
					textLines.forEach((line: string, lineIndex: number) => {
						const textWidth = pdf.getTextWidth(line);
						const xPosition = rulerStartX + (200 - textWidth) / 2;

						pdf.text(
							line,
							xPosition - 25,
							yCenteredPosition + lineIndex * lineHeight + 3,
						);
					});
				}
			} else {
				console.warn(`Profundidade ${depth} fora do intervalo visível`);
			}
		});
	}

	// FUNÇÃO PARA DESENHAR AS DESCRIÇÕES DA SEGUNDA PÁGINA
	function drawLayerDescriptionsForPageTwo(
		pdf: any,
		rulerStartX: number,
		rulerSpacing: number,
		pageHeight: number,
		startY: number,
		listDescriptionsForPageTwo: string[], // Lista de descrições da segunda página
		listDepthPageTwo: number[], // Lista de profundidades da segunda página
		finalDepthForPageTwo: number, // Última profundidade da primeira página
	) {
		const maxLineLength = 39;
		const lineHeight = 5;
		pdf.setFontSize(8);
		const pageMargin = 20;
		let currentYPosition = startY;

		listDescriptionsForPageTwo.forEach(
			(description: string, index: number) => {
				const currentDepth = listDepthPageTwo[index];
				const prevDepth =
					index === 0
						? finalDepthForPageTwo
						: listDepthPageTwo[index - 1];

				// Centralizar o texto entre a profundidade anterior e a profundidade atual
				const yPosition =
					currentYPosition +
					((prevDepth + currentDepth) / 2 - finalDepthForPageTwo) *
						rulerSpacing;

				if (yPosition >= 0 && yPosition <= pageHeight - pageMargin) {
					const textLines = description.match(
						new RegExp('.{1,' + maxLineLength + '}', 'g'),
					);

					if (textLines) {
						const textHeightApprox = lineHeight * textLines.length;
						const yCenteredPosition =
							yPosition - textHeightApprox / 2;

						pdf.setFillColor(255, 255, 255); // Cor branca para o fundo
						textLines.forEach((line: string, lineIndex: number) => {
							const textWidth = pdf.getTextWidth(line);
							const xPosition =
								rulerStartX + (200 - textWidth) / 2;

							pdf.text(
								line,
								xPosition - 25,
								yCenteredPosition +
									lineIndex * lineHeight -
									finalDepthForPageTwo / 2,
							);
						});
					}
				} else {
					console.warn(
						`Posição Y ${yPosition} fora do intervalo visível`,
					);
				}

				// Atualiza a posição Y para a próxima camada
				currentYPosition += rulerSpacing;
			},
		);
	}

	//FUNÇÃO PARA DESENHAR A LINHA DAS PROFUNDIDADES
	function drawLinesProfundities() {
		doc.setDrawColor('#000');
		data.profundidadeCamada.forEach((depth: number) => {
			// Calcular a posição Y para a profundidade
			const depthYPosition = startY + depth * rulerSpacing;

			// Ajustar a profundidade se estiver fora do intervalo visível
			if (depthYPosition < startY) {
				console.log(
					`Profundidade ${depth} abaixo da posição inicial da régua`,
				);
			} else if (depthYPosition > pageHeight) {
				console.log(`Profundidade ${depth} acima do limite da página`);
				finalDepth = depth;
				console.log(finalDepth, 'aqui');

				return;
			} else {
				doc.setLineWidth(0.2);
				doc.line(
					rulerStartX,
					depthYPosition,
					pageWidth - 84,
					depthYPosition,
				);

				doc.setFontSize(10);
				doc.text(
					depth.toString(),
					rulerStartX + 28,
					depthYPosition - 0.5,
				);

				lineOffImages = depthYPosition;

				console.log(
					`Linha de profundidade ${depth} traçada na posição Y: ${depthYPosition}`,
				);
			}
		});
	}

	// FUNÇÃO PARA DESENHAR AS LINHAS DA SEGUNDA PÁGINA
	function drawLinesProfunditiesPageTwo(
		doc: any,
		rulerStartX: number,
		rulerSpacing: number,
		pageHeight: number,
		pageWidth: number,
		startY: number, // O início da segunda página (deve ser o topo da página)
		finalDepth: number, // Última profundidade da página 1
		listDepthPageTwo: number[], // Lista de profundidades para a página 2
	) {
		doc.setDrawColor('#000');

		// Iterar pelas profundidades da página 2
		listDepthPageTwo.forEach((depth: number) => {
			// Ajustar a profundidade para continuar a partir da profundidade final da página 1
			const adjustedDepth = depth - finalDepth;

			// Calcular a posição Y para a profundidade na página 2
			const depthYPosition = startY + adjustedDepth * rulerSpacing;

			// Ajustar a profundidade se estiver fora do intervalo visível
			if (depthYPosition < startY) {
				console.log(
					`Profundidade ${depth} abaixo da posição inicial da régua da página 2`,
				);
			} else if (depthYPosition > pageHeight) {
				console.log(
					`Profundidade ${depth} acima do limite da página 2`,
				);

				// Atualizar a profundidade final para a próxima página, se necessário
				finalDepth = depth;
				console.log(finalDepth, 'aqui');

				return;
			} else {
				// Desenhar a linha da profundidade
				doc.setLineWidth(0.2);
				doc.line(
					rulerStartX,
					depthYPosition,
					pageWidth - 84,
					depthYPosition,
				);

				// Escrever a profundidade
				doc.setFontSize(10);
				doc.text(
					depth.toString(),
					rulerStartX + 28,
					depthYPosition - 0.5,
				);

				console.log(
					`Linha de profundidade ${depth} traçada na posição Y: ${depthYPosition}`,
				);
			}
		});
	}

	//FUNÇÃO PARA ITERAR SOBRE PROFUNDITIES E DESENHAR NO PDF
	function drawProfundities() {
		// Função para desenhar o texto com base no número de dígitos
		function drawTextBasedOnDigits(
			pdf: any,
			value: number,
			initialX: number,
			adjustedYPosition: number,
		) {
			// Converte o valor numérico para string
			const valueStr = value.toString();

			// Verifica se o valor tem 2 dígitos ou mais e ajusta o X
			const adjustedXPosition =
				valueStr.length === 2 ? initialX + 5 : initialX + 6;

			// Desenha o texto no PDF com o X ajustado
			pdf.text(valueStr, adjustedXPosition, adjustedYPosition);
		}

		for (
			let index = 0;
			index < data.profundities.length && index <= 17;
			index++
		) {
			const profundity = data.profundities[index];
			const adjustedYPosition = startY + (index + 0.5) * rulerSpacing;
			doc.setFontSize(8);

			// Calcula a posição Y para o meio de cada intervalo de profundidade (0.5, 1.5, 2.5, etc.)

			// Adiciona os hits e profundidades ao PDF na mesma linha, centralizados no eixo Y
			doc.setDrawColor('#fff');
			doc.setFillColor(255, 255, 255);
			doc.rect(marginLeft + 144, 50.5, 20, 10, 'FD');
			23;

			// Desenha hit1 e profundity1 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit1!,
				initialX - 6,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX - 1,
				adjustedYPosition + 0.3,
				initialX + 2,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity1!,
				initialX - 6,
				adjustedYPosition + 3,
			);

			// Verifica e desenha hit2 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit2!,
				initialX,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX + 5,
				adjustedYPosition + 0.3,
				initialX + 8,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity2!,
				initialX,
				adjustedYPosition + 3,
			);

			// Desenha hit3 e profundity3 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit3!,
				initialX + 6,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX + 11,
				adjustedYPosition + 0.3,
				initialX + 14,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity3!,
				initialX + 6,
				adjustedYPosition + 3,
			);

			// Defina as variáveis da marcação
			const lineOffsets = [
				marginLeft + 149, // Posição para 0-5
				marginLeft + 152, // Posição para 5-10
				marginLeft + 155, // Posição para 10-15
				marginLeft + 158, // Posição para 15-20
				marginLeft + 161, // Posição para 20-25
				marginLeft + 164, // Posição para 25-30
				marginLeft + 167, // Posição para 30-35
				marginLeft + 170, // Posição para 35-40
				marginLeft + 173, // Posição para 40-45
				marginLeft + 176, // Posição para 45-50
			];

			// Desenhar a linha de base
			const startX = marginLeft + 165; // Alinhar o início da régua ao `marginLeft`
			const endX = marginLeft + 198; // Alinhar o fim da régua à última posição
			const yBase = 50; // Posição base no eixo Y
			doc.setLineWidth(0.1);
			doc.setDrawColor(0, 0, 0); // Preto
			doc.line(startX, yBase, endX, yBase);

			// Armazenar as posições das marcações
			const result = profundity.hit2! + profundity.hit3!;

			// Determinar o índice da coluna mais próxima
			const nearestLineIndex = Math.min(
				Math.floor(result / lineSpacing), // Usar `result` para determinar a coluna correta
				lineOffsets.length - 1,
			);

			const nearestLinePosition = lineOffsets[nearestLineIndex];
			const nextLinePosition =
				lineOffsets[nearestLineIndex + 1] ||
				nearestLinePosition + lineSpacing;
			const positionWithinColumn = (result % lineSpacing) / lineSpacing;
			const markPosition =
				nearestLinePosition +
				positionWithinColumn * (nextLinePosition - nearestLinePosition);

			console.log(markPosition);

			// Adicionar a posição da marcação para a linha
			markPositions.push({
				x: markPosition + 19,
				y: adjustedYPosition,
			});

			const resultProfundity =
				profundity.profundity2! + profundity.profundity3!;
			if (result !== 0) {
				// Desenhar a marcação
				doc.setFont('Times New Roman', 'normal');
				doc.setFontSize(10);
				doc.text(
					result.toString(),
					markPosition + 20,
					adjustedYPosition + 1,
				); // Ajuste a posição Y conforme necessário
				if (resultProfundity !== 30) {
					doc.text(
						`/${resultProfundity}`,
						markPosition + 22,
						adjustedYPosition + 1,
					); // Ajuste a posição Y conforme necessário
				}
			}
			const hitsSum = profundity.hit2! + profundity.hit3!;
			listHits.push(hitsSum);
		}
		for (let i = 0; i < markPositions.length - 1; i++) {
			doc.setDrawColor('red');
			const start = markPositions[i];
			const end = markPositions[i + 1];
			doc.line(start.x, start.y, end.x, end.y);
		}
	}

	//FUNÇÃO PARA ITERAR SOBRE PROFUNDITIES E DESENHAR NO PDF
	function drawProfunditiesForPageTwo(finalDepth: number) {
		// Função para desenhar o texto com base no número de dígitos
		function drawTextBasedOnDigits(
			pdf: any,
			value: number,
			initialX: number,
			adjustedYPosition: number,
		) {
			// Converte o valor numérico para string
			const valueStr = value.toString();

			// Verifica se o valor tem 2 dígitos ou mais e ajusta o X
			const adjustedXPosition =
				valueStr.length === 2 ? initialX + 5 : initialX + 6;

			// Desenha o texto no PDF com o X ajustado
			pdf.text(valueStr, adjustedXPosition, adjustedYPosition);
		}

		for (
			let index = 17;
			index < data.profundities.length && index >= 17;
			index++
		) {
			const profundity = data.profundities[index];
			const adjustedYPosition =
				startY + (index - finalDepth + 1.5) * rulerSpacing;
			doc.setFontSize(8);

			// Calcula a posição Y para o meio de cada intervalo de profundidade (0.5, 1.5, 2.5, etc.)

			// Adiciona os hits e profundidades ao PDF na mesma linha, centralizados no eixo Y

			// Desenha hit1 e profundity1 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit1!,
				initialX - 6,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX - 1,
				adjustedYPosition + 0.3,
				initialX + 2,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity1!,
				initialX - 6,
				adjustedYPosition + 3,
			);

			// Verifica e desenha hit2 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit2!,
				initialX,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX + 5,
				adjustedYPosition + 0.3,
				initialX + 8,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity2!,
				initialX,
				adjustedYPosition + 3,
			);

			// Desenha hit3 e profundity3 no ponto 0.5 da régua
			drawTextBasedOnDigits(
				doc,
				profundity.hit3!,
				initialX + 6,
				adjustedYPosition,
			);
			doc.setLineWidth(0.2);
			doc.line(
				initialX + 11,
				adjustedYPosition + 0.3,
				initialX + 14,
				adjustedYPosition + 0.3,
			);
			drawTextBasedOnDigits(
				doc,
				profundity.profundity3!,
				initialX + 6,
				adjustedYPosition + 3,
			);

			// Defina as variáveis da marcação
			const lineOffsets = [
				marginLeft + 149, // Posição para 0-5
				marginLeft + 152, // Posição para 5-10
				marginLeft + 155, // Posição para 10-15
				marginLeft + 158, // Posição para 15-20
				marginLeft + 161, // Posição para 20-25
				marginLeft + 164, // Posição para 25-30
				marginLeft + 167, // Posição para 30-35
				marginLeft + 170, // Posição para 35-40
				marginLeft + 173, // Posição para 40-45
				marginLeft + 176, // Posição para 45-50
			];

			// Desenhar a linha de base
			const startX = marginLeft + 165; // Alinhar o início da régua ao `marginLeft`
			const endX = marginLeft + 198; // Alinhar o fim da régua à última posição
			const yBase = 50; // Posição base no eixo Y
			doc.setLineWidth(0.1);
			doc.setDrawColor(0, 0, 0); // Preto
			doc.line(startX, yBase, endX, yBase);

			// Armazenar as posições das marcações
			const result = profundity.hit2! + profundity.hit3!;

			// Determinar o índice da coluna mais próxima
			const nearestLineIndex = Math.min(
				Math.floor(result / lineSpacing), // Usar `result` para determinar a coluna correta
				lineOffsets.length - 1,
			);

			const nearestLinePosition = lineOffsets[nearestLineIndex];
			const nextLinePosition =
				lineOffsets[nearestLineIndex + 1] ||
				nearestLinePosition + lineSpacing;
			const positionWithinColumn = (result % lineSpacing) / lineSpacing;
			const markPosition =
				nearestLinePosition +
				positionWithinColumn * (nextLinePosition - nearestLinePosition);

			console.log(markPosition);

			// Adicionar a posição da marcação para a linha
			markPositions.push({
				x: markPosition + 19,
				y: adjustedYPosition,
			});

			const resultProfundity =
				profundity.profundity2! + profundity.profundity3!;
			if (result !== 0) {
				// Desenhar a marcação
				doc.setFont('Times New Roman', 'normal');
				doc.setFontSize(10);
				doc.text(
					result.toString(),
					markPosition + 20,
					adjustedYPosition + 1,
				); // Ajuste a posição Y conforme necessário
				if (resultProfundity !== 30) {
					doc.text(
						`/${resultProfundity}`,
						markPosition + 23.5,
						adjustedYPosition + 1,
					); // Ajuste a posição Y conforme necessário
				}
			}
			const hitsSum = profundity.hit2! + profundity.hit3!;
			listHits.push(hitsSum);
		}
		for (let i = 18; i < markPositions.length - 1; i++) {
			doc.setDrawColor('red');
			const start = markPositions[i];
			const end = markPositions[i + 1];
			doc.line(start.x, start.y, end.x, end.y);
		}
	}

	//FUNÇÃO PARA VER A DESCRIÇÃO E DESENHAR A CLASSIFICAÇÃO
	function checkSoilDescriptionAndDrawText(
		pdf: any,
		data: any,
		rulerStartX: number,
		rulerSpacing: number,
		startY: number,
		listHits: number[], // Inclua listHits como parâmetro
	) {
		pdf.setDrawColor('#000');

		// Função para desenhar texto com quebras de linha
		function drawSoilText(text: string, yPosition: number) {
			const maxLineLength = 10; // Número máximo de caracteres por linha
			const lineHeight = 3; // Espaçamento entre linhas

			// Divide o texto em várias linhas com base no comprimento máximo
			const textLines = text.match(
				new RegExp('.{1,' + maxLineLength + '}', 'g'),
			);

			if (textLines) {
				textLines.forEach((line: string, index: number) => {
					// Obtém a largura do texto da linha atual
					const textWidth =
						(pdf.getStringUnitWidth(line) *
							pdf.internal.getFontSize()) /
						pdf.internal.scaleFactor;

					// Calcula a posição X para centralizar o texto
					const centerX =
						rulerStartX +
						111 +
						(pageWidth - 66 - (rulerStartX + 111) - textWidth) / 2;

					// Desenha o texto centralizado
					pdf.text(line, centerX, yPosition + index * lineHeight);
				});
			}
		}

		const maxDepth = Math.max(...data.layer.map((p: any) => p.depth));

		// Maior profundidade
		let currentLayerIndex = 0;
		let prevText = ''; // Armazena o texto anterior para evitar duplicação

		// Loop sobre cada metro até a profundidade máxima
		for (let meter = 0; meter <= maxDepth; meter++) {
			const currentDepth = meter;
			const nextDepth = meter + 1;

			// Acessa a camada atual
			let layer = data.layer[currentLayerIndex];

			// Avança para a próxima camada se a profundidade atual ultrapassar a profundidade da camada
			while (layer && currentDepth >= layer.depth) {
				currentLayerIndex++;
				layer = data.layer[currentLayerIndex];
			}

			// Se não houver mais camadas, saia do loop
			if (!layer) {
				break;
			}

			// Desestrutura os dados da camada
			const { description } = layer;
			let soilText = '';

			// Verifica se o valor de listHits corresponde ao índice atual
			const listHitValue = listHits[meter] ?? 0;

			// Classificação para solos arenosos e siltosos
			if (
				description.includes('AREIA FINA ARENOSA') ||
				description.includes('AREIA FINA SILTOSA') ||
				description.includes('AREIA FINA ARGILOSA') ||
				description.includes('SILTE ARENOSO') ||
				description.includes('SILTE SILTOSO')
			) {
				// Regras para solos arenosos e siltosos baseadas na soma de hit2 e hit3
				if (listHitValue <= 4) {
					soilText = 'Fofa(o)';
				} else if (listHitValue >= 5 && listHitValue <= 8) {
					soilText = 'Pouco compacta(o)';
				} else if (listHitValue >= 9 && listHitValue <= 18) {
					soilText = 'Medianamente compacta(o)';
				} else if (listHitValue >= 19 && listHitValue <= 40) {
					soilText = 'Compacta(o)';
				} else if (listHitValue > 40) {
					soilText = 'Muito compacta(o)';
				}
			}
			// Classificação para solos argilosos
			else if (
				description.includes('SILTE ARGILOSO.') ||
				description.includes('ARGILA ARENOSA, COR VERMELHA ESCURA.') ||
				description.includes(
					'ARGILA ARENOSA (ARENITO), COR VERMELHA CLARA COM MANCHAS CINZA CLARA.',
				) ||
				description.includes(
					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA.',
				) ||
				description.includes(
					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA E CINZA ESCURA.',
				) ||
				description.includes('ARGILA ARENOSA, COR VERMELHA CLARA.') ||
				description.includes('ARGILA SILTOSA, COR VERMELHA CLARA.') ||
				description.includes(
					'ARGILA SILTOSA, COR VERMELHA CLARA COM MANCHAS CINZA .',
				) ||
				description.includes(
					'ARGILA SILTOSA, COR VERMELHA ESCURA COM MANCHAS CINZA ESCURA.',
				) ||
				description.includes('ARGILA SILTOSA, COR VERMELHA ESCURA.') ||
				description.includes(
					'ARGILA SILTOSA COM SEIXOS, COR VERMELHA CLARA.',
				) ||
				description.includes('ARGILA ARGILOSA.')
			) {
				// Regras para solos argilosos baseadas na soma de hit2 e hit3
				if (listHitValue <= 2) {
					soilText = 'Muito mole';
				} else if (listHitValue >= 3 && listHitValue <= 5) {
					soilText = 'Mole';
				} else if (listHitValue >= 6 && listHitValue <= 10) {
					soilText = 'Média(o)';
				} else if (listHitValue >= 11 && listHitValue <= 19) {
					soilText = 'Rija(o)';
				} else if (listHitValue > 19) {
					soilText = 'Dura(o)';
				}
			}
			listSoilText.push(soilText);

			const yPosition = startY + (meter + 1) * rulerSpacing; // Calcula a posição Y para a linha

			// Ajusta a posição Y para o centro do texto
			const textHeight = 1; // Altura do texto
			const adjustedYPosition = yPosition - textHeight / 2; // Centraliza o texto em relação à linha

			// Se o texto do solo atual for diferente do anterior, desenhe-o
			if (soilText !== prevText) {
				// Defina o tamanho da fonte e desenhe o texto
				pdf.setFontSize(8);
				drawSoilText(soilText, adjustedYPosition); // Desenha o texto ajustado na posição Y

				pdf.line(
					rulerStartX + 110,
					prevYPosition,
					pageWidth - 66,
					prevYPosition,
				);

				// Atualiza o texto anterior
				prevText = soilText;
			}
			prevYPosition = yPosition;
		}

		// Desenhe a linha final no final da profundidade
		if (prevText) {
			const finalYPosition = startY + (maxDepth + 0.5) * rulerSpacing;
			pdf.line(
				rulerStartX + 110,
				finalYPosition,
				pageWidth - 66,
				finalYPosition,
			);
		}
	}

	// FUNÇÃO PARA VER A DESCRIÇÃO E DESENHAR A CLASSIFICAÇÃO NA PÁGINA 2
	function checkSoilDescriptionAndDrawTextForPageTwo(
		pdf: any,
		data: any,
		rulerStartX: number,
		rulerSpacing: number,
		startY: number,
		listHits: number[], // Inclua listHits como parâmetro
		finalDepth: number, // Adicione o finalDepth como parâmetro
	) {
		pdf.setDrawColor('#000');

		// Função para desenhar texto com quebras de linha
		function drawSoilText(text: string, yPosition: number) {
			const maxLineLength = 10; // Número máximo de caracteres por linha
			const lineHeight = 3; // Espaçamento entre linhas

			// Divide o texto em várias linhas com base no comprimento máximo
			const textLines = text.match(
				new RegExp('.{1,' + maxLineLength + '}', 'g'),
			);

			if (textLines) {
				textLines.forEach((line: string, index: number) => {
					// Obtém a largura do texto da linha atual
					const textWidth =
						(pdf.getStringUnitWidth(line) *
							pdf.internal.getFontSize()) /
						pdf.internal.scaleFactor;

					// Calcula a posição X para centralizar o texto
					const centerX =
						rulerStartX +
						111 +
						(pageWidth - 66 - (rulerStartX + 111) - textWidth) / 2;

					// Desenha o texto centralizado
					pdf.text(line, centerX, yPosition + index * lineHeight);
				});
			}
		}

		const maxDepth = Math.max(...data.layer.map((p: any) => p.depth));

		let currentLayerIndex = 10; // Começa do índice da página 2
		let prevText = ''; // Armazena o texto anterior para evitar duplicação
		let prevYPosition = startY; // Posição Y inicial para a Página 2

		// Loop sobre cada metro até a profundidade máxima
		for (let meter = 18; meter <= maxDepth; meter++) {
			// Começa do metro logo após finalDepth
			const currentDepth = meter;

			// Acessa a camada atual
			let layer = data.layer[currentLayerIndex];

			// Avança para a próxima camada se a profundidade atual ultrapassar a profundidade da camada
			while (layer && currentDepth >= layer.depth) {
				currentLayerIndex++;
				layer = data.layer[currentLayerIndex];
			}

			// Se não houver mais camadas, saia do loop
			if (!layer) {
				break;
			}

			// Desestrutura os dados da camada
			const { description } = layer;
			let soilText = '';

			// Verifica se o valor de listHits corresponde ao índice atual
			const listHitValue = listHits[meter] ?? 0;

			// Classificação para solos arenosos e siltosos
			if (
				description.includes('AREIA FINA ARENOSA') ||
				description.includes('AREIA FINA SILTOSA') ||
				description.includes('AREIA FINA ARGILOSA') ||
				description.includes('SILTE ARENOSO') ||
				description.includes('SILTE SILTOSO')
			) {
				// Regras para solos arenosos e siltosos baseadas na soma de hit2 e hit3
				if (listHitValue <= 4) {
					soilText = 'Fofa(o)';
				} else if (listHitValue >= 5 && listHitValue <= 8) {
					soilText = 'Pouco compacta(o)';
				} else if (listHitValue >= 9 && listHitValue <= 18) {
					soilText = 'Medianamente compacta(o)';
				} else if (listHitValue >= 19 && listHitValue <= 40) {
					soilText = 'Compacta(o)';
				} else if (listHitValue > 40) {
					soilText = 'Muito compacta(o)';
				}
			}
			// Classificação para solos argilosos
			else if (
				description.includes('SILTE ARGILOSO.') ||
				description.includes('ARGILA ARENOSA, COR VERMELHA ESCURA.') ||
				description.includes(
					'ARGILA ARENOSA (ARENITO), COR VERMELHA CLARA COM MANCHAS CINZA CLARA.',
				) ||
				description.includes(
					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA.',
				) ||
				description.includes(
					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA E CINZA ESCURA.',
				) ||
				description.includes('ARGILA ARENOSA, COR VERMELHA CLARA.') ||
				description.includes('ARGILA SILTOSA, COR VERMELHA CLARA.') ||
				description.includes(
					'ARGILA SILTOSA, COR VERMELHA CLARA COM MANCHAS CINZA .',
				) ||
				description.includes(
					'ARGILA SILTOSA, COR VERMELHA ESCURA COM MANCHAS CINZA ESCURA.',
				) ||
				description.includes('ARGILA SILTOSA, COR VERMELHA ESCURA.') ||
				description.includes(
					'ARGILA SILTOSA COM SEIXOS, COR VERMELHA CLARA.',
				) ||
				description.includes('ARGILA ARGILOSA.')
			) {
				// Regras para solos argilosos baseadas na soma de hit2 e hit3
				if (listHitValue <= 2) {
					soilText = 'Muito mole';
				} else if (listHitValue >= 3 && listHitValue <= 5) {
					soilText = 'Mole';
				} else if (listHitValue >= 6 && listHitValue <= 10) {
					soilText = 'Média(o)';
				} else if (listHitValue >= 11 && listHitValue <= 19) {
					soilText = 'Rija(o)';
				} else if (listHitValue > 19) {
					soilText = 'Dura(o)';
				}
			}

			const yPosition = startY + (meter - finalDepth + 1) * rulerSpacing; // Ajusta a posição Y para a Página 2

			// Ajusta a posição Y para o centro do texto
			const textHeight = 8; // Altura do texto
			const adjustedYPosition = yPosition - textHeight / 2; // Centraliza o texto em relação à linha

			// Se o texto do solo atual for diferente do anterior, desenhe-o
			if (soilText !== prevText) {
				// Defina o tamanho da fonte e desenhe o texto
				pdf.setFontSize(8);
				drawSoilText(soilText, adjustedYPosition); // Desenha o texto ajustado na posição Y

				pdf.line(
					rulerStartX + 110,
					prevYPosition,
					pageWidth - 66,
					prevYPosition,
				);

				// Atualiza o texto anterior
				prevText = soilText;
			}
			prevYPosition = yPosition;
		}

		// Desenhe a linha final no final da profundidade
		if (prevText) {
			const finalYPosition =
				startY + (maxDepth - finalDepth) * rulerSpacing;
			pdf.line(
				rulerStartX + 110,
				finalYPosition,
				pageWidth - 66,
				finalYPosition,
			);
			//GAMBETA
			doc.setDrawColor('#fff');
			doc.setFillColor(255, 255, 255);
			doc.rect(rulerStartX + 111, finalYPosition - 99, 16, 50, 'F');

			doc.text('Dura(o)', rulerStartX + 115, finalYPosition - 60);
		}
	}

	//FUNÇÃO PARA DESENHAR HACHURAS
	function drawHatch() {
		data.layer.forEach((layer: any, index: number) => {
			// Desenha quadrado para cada intervalo de metro
			if (index <= 7) {
				const previousDepth =
					index === 0 ? 0 : data.layer[index - 1].depth;
				const currentDepth = layer.depth;

				const imgHeight =
					(layer.depth -
						(index === 0 ? 0 : data.layer[index - 1].depth)) *
						rulerSpacing -
					0.8;
				const adjustedHeight = Math.max(imgHeight, 0);
				const imgY =
					startY +
					(index === 0 ? 0 : data.layer[index - 1].depth) *
						rulerSpacing;
				const imgX = marginLeft + 15.5;
				const squareWidth = 20;
				const imgWidth = squareWidth;

				// Adicionando a imagem ao PDF
				if (
					layer.backgroundImage.startsWith('data:image/png;base64,')
				) {
					doc.addImage(
						layer.backgroundImage,
						'PNG',
						imgX,
						imgY + 0.5,
						imgWidth - 1,
						adjustedHeight,
					);
				} else {
					console.error(
						`Layer ${index} não tem uma imagem PNG válida.`,
					);
				}

				for (
					let meter = Math.ceil(previousDepth);
					meter <= Math.floor(currentDepth);
					meter++
				) {
					// Desenhando quadrado seguindo as metragens da régua
					doc.setDrawColor(0); // Cor do contorno (0 = preto)
					doc.setFillColor(255, 255, 255); // Cor de preenchimento (branco)
					// Calcula a posição Y centralizada no meio do metro (ex: 0.5, 1.5, etc.)
					const squareY = startY + meter * rulerSpacing - 5;

					// Desenha o quadrado
					doc.rect(
						marginLeft + 22,
						squareY + 5,
						imgWidth - 15,
						rulerSpacing / 2 - 2,
						'FD',
					); // Quadrado pequeno

					// Coloca a numeração dentro do quadrado
					doc.setFontSize(8);
					doc.text(
						String(meter),
						marginLeft + 23,
						squareY + rulerSpacing / 4 + 5,
					);
				}
			}
		});
		doc.setFillColor(255, 255, 255);
		doc.rect(marginLeft + 21.5, 69, 6, 3, 'FD');
		doc.text('2,00', marginLeft + 22, 71.5);

		doc.setLineWidth(0.8);
		doc.line(marginLeft + 15, 50, marginLeft + 15, 75);
		doc.line(marginLeft + 35, 50, marginLeft + 35, 75);

		// Extrai o valor do texto e converte para número (substitui vírgula por ponto)
		const valueText = '15,67';
		const valueNumber = parseFloat(valueText.replace(',', '.'));

		// Defina a escala da régua (por exemplo, quantos pixels por metro)
		const pixelsPerMeter = 12; // Ajuste este valor com base na escala da régua

		// Calcula a posição Y com base no valor numérico e na escala
		const yPosition = startY + valueNumber * pixelsPerMeter;

		// Desenha o texto e a imagem na posição calculada
		doc.text(valueText, marginLeft + 200, yPosition);
		doc.addImage(data.na, 'PNG', marginLeft + 200, yPosition + 3, 8, 8); // Ajusta a posição da imagem

		doc.addImage(
			data.footer,
			'PNG',
			marginLeft,
			yPosition + 26,
			pageWidth - marginRight,
			yPosition - 205,
		);

		//GAMBETA
		doc.setDrawColor('#fff');
		doc.setLineWidth(0.1);
		doc.setFillColor(255, 255, 255);
		doc.rect(marginLeft + 30, startY + 218, 10, 3, 'F');
		doc.rect(marginLeft + 30, startY + 220, 10, 3, 'F');
		doc.rect(marginLeft + 102.5, startY + 236.5, 20, 4, 'F');
		doc.rect(marginLeft + 138, startY + 229.5, 20, 4, 'F');
		doc.rect(marginLeft + 175, startY + 229.5, 20, 4, 'F');
		doc.rect(marginLeft + 83, startY + 220, 10, 3, 'F');
		doc.rect(marginLeft + 70, startY + 223, 22, 3, 'F');

		doc.setFontSize(7);
		doc.text(data.intervalo, marginLeft + 32.5, startY + 220.5);
		doc.text(data.intervalo2, marginLeft + 32.5, startY + 223.5);
		doc.text(data.espiralFinal, marginLeft + 84, startY + 222.5);
		doc.text(data.waterLevel, marginLeft + 71.5, startY + 225.5);
		doc.text(data.waterLevelTwo, marginLeft + 84, startY + 225.5);

		const dataInicio = new Date(data.dataInicio).toLocaleDateString(
			'pt-BR',
		);

		doc.setFontSize(10);
		doc.setFont('Times New Roman', 'normal');
		doc.setTextColor(50, 50, 50); // Usando o valor RGB
		doc.text(dataInicio, marginLeft + 138, startY + 232.5);
		doc.text('1 / 2', marginLeft + 176, startY + 232.5);

		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text('0001', marginLeft + 105, startY + 240);
	}

	//FUNÇÃO PARA DESENHAR HACHURAS
	function drawHatchForPageTwo(
		doc: any,
		data: any,
		marginLeft: number,
		rulerSpacing: number,
		startY: number,
		finalDepthForPageTwo: number, // Profundidade final da página 1
	) {
		// Adicione uma profundidade inicial para a página 2 baseada na profundidade final da página 1
		const initialDepthForPageTwo = finalDepthForPageTwo;

		// Verifique se os dados e variáveis estão definidos
		if (!data || !data.layer) {
			console.error('Dados ou camada não encontrados.');
			return;
		}

		// Verifique se o rulerSpacing e startY são números válidos
		if (isNaN(rulerSpacing) || isNaN(startY)) {
			console.error('rulerSpacing ou startY devem ser números válidos.');
			return;
		}

		data.layer.forEach((layer: any, index: number) => {
			if (index >= 8) {
				console.log(`Drawing hatch for layer index: ${index}`); // Adicione logs para depuração

				// Ajuste a profundidade anterior e atual para a página 2
				const previousDepth =
					index === 0
						? initialDepthForPageTwo
						: data.layer[index - 1].depth;
				const currentDepth = layer.depth;

				// Verifique se a profundidade é válida
				if (
					isNaN(previousDepth) ||
					isNaN(currentDepth) ||
					currentDepth <= previousDepth
				) {
					console.error(
						`Profundidade inválida na camada ${index}: previousDepth = ${previousDepth}, currentDepth = ${currentDepth}`,
					);
					return;
				}

				// Calcule a altura e ajuste se necessário
				const imgHeight =
					(currentDepth - previousDepth) * rulerSpacing - 0.8;
				const adjustedHeight = Math.max(imgHeight, 0);

				// Certifique-se de que a altura é adequada para a página
				if (adjustedHeight <= 0) {
					console.error(
						`Altura da imagem inválida para a camada ${index}: ${adjustedHeight}`,
					);
					return;
				}

				// Ajuste o posicionamento vertical para a imagem
				const imgY = startY + previousDepth * rulerSpacing;
				const imgX = marginLeft + 15.5;
				const squareWidth = 20;
				const imgWidth = squareWidth;

				if (
					layer.backgroundImage.startsWith('data:image/png;base64,')
				) {
					doc.addImage(
						layer.backgroundImage,
						'PNG',
						imgX,
						imgY - 213, // Ajuste o posicionamento vertical conforme necessário
						imgWidth - 1,
						adjustedHeight,
					);
				} else {
					console.error(
						`Layer ${index} não tem uma imagem PNG válida.`,
					);
				}

				// Desenho dos quadrados para cada metro
				for (
					let meter = Math.ceil(previousDepth);
					meter <= Math.floor(currentDepth);
					meter++
				) {
					doc.setDrawColor(0);
					doc.setFillColor(255, 255, 255);

					const squareY = startY + meter * rulerSpacing - 5;
					doc.rect(
						marginLeft + 22,
						squareY - 211,
						imgWidth - 15,
						rulerSpacing / 2 - 2,
						'FD',
					);

					doc.setFontSize(8);
					doc.text(String(meter), marginLeft + 23, squareY - 208);
				}
			}
		});

		doc.setFillColor(255, 255, 255);
		doc.rect(marginLeft + 21.5, 69, 6, 3, 'FD');
		doc.text('2,00', marginLeft + 22, 71.5);

		doc.setLineWidth(0.8);
		doc.line(marginLeft + 15, 50, marginLeft + 15, 75);
		doc.line(marginLeft + 35, 50, marginLeft + 35, 75);

		doc.addImage(
			data.footer,
			'PNG',
			marginLeft,
			startY + 205,
			pageWidth - marginRight,
			startY - 205,
		);

		//GAMBETA
		doc.setDrawColor('#fff');
		doc.setLineWidth(0.1);
		doc.setFillColor(255, 255, 255);
		doc.rect(marginLeft + 30, startY + 211, 10, 3, 'F');
		doc.rect(marginLeft + 30, startY + 214, 10, 3, 'F');
		doc.rect(marginLeft + 103, startY + 235, 20, 4, 'F');
		doc.rect(marginLeft + 138, startY + 225, 20, 4, 'F');
		doc.rect(marginLeft + 175, startY + 225, 20, 4, 'F');
		doc.rect(marginLeft + 83, startY + 214, 10, 3, 'F');
		doc.rect(marginLeft + 70, startY + 217, 22, 3, 'F');

		doc.setFontSize(7);
		doc.text(data.intervalo, marginLeft + 32.5, startY + 213.5);
		doc.text(data.intervalo2, marginLeft + 32.5, startY + 216.5);
		doc.text(data.espiralFinal, marginLeft + 84, startY + 216.5);
		doc.text(data.waterLevel, marginLeft + 71.5, startY + 219.5);
		doc.text(data.waterLevelTwo, marginLeft + 84, startY + 219.5);

		const dataInicio = new Date(data.dataInicio).toLocaleDateString(
			'pt-BR',
		);

		doc.setFontSize(10);
		doc.setFont('Times New Roman', 'normal');
		doc.setTextColor(50, 50, 50); // Usando o valor RGB
		doc.text(dataInicio, marginLeft + 138, startY + 228);
		doc.text('2 / 2', marginLeft + 176, startY + 228);

		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text('0001', marginLeft + 105, startY + 238);
	}

	// Salve o PDF
	doc.save('grafico.pdf');
};

export default generatePDF;
