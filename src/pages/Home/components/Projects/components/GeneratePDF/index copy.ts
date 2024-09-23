/* eslint-disable prettier/prettier */
// generatePDF.ts
import jsPDF from 'jspdf';
import { useAppSelector } from '../../../../../../store/hooks';

interface GeneratePDFProps {
	data: {
		username: string;
		obra: string;
		local: string;
		furo: string;
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
	const rulerSpacing = 15; // Espaçamento entre as linhas da régua
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
	const listHits: any[] = [];

	// const drawSecondPageContent = (
	// 	pdf: any,
	// 	data: any,
	// 	startY: number,
	// 	rulerSpacing: number,
	// 	pageHeight: number,
	// 	rulerStartX: number,
	// 	pageWidth: number,
	// 	startDepth: number, // Profundidade inicial da segunda página
	// 	startDescription: string, // Descrição inicial da segunda página
	// ) => {
	// 	pdf.addPage();
	// 	// Atualize o início da página com base na última profundidade da página anterior
	// 	let initialDepth = startDepth; // Profundidade inicial da nova página
	// 	let initialDescription = startDescription;
	// 	const initialYPosition = startY + initialDepth * rulerSpacing; // Ajusta a posição inicial Y

	// 	//FUNÇÕES
	// 	// Função para desenhar as linhas horizontais marcando os metros
	// 	function drawHorizontalLines(
	// 		pdf: any,
	// 		rulerStartX: number,
	// 		pageWidth: number,
	// 		rulerSpacing: number,
	// 		startY: number,
	// 		totalMeters: number,
	// 	) {
	// 		for (let i = 0; i <= totalMeters; i++) {
	// 			// Calcula a posição Y para cada metro na régua (1, 2, 3, etc.)
	// 			const yPosition = startY + i * rulerSpacing;

	// 			pdf.setLineWidth(0.1);
	// 			pdf.line(
	// 				rulerStartX + 110,
	// 				yPosition,
	// 				pageWidth - 66,
	// 				yPosition,
	// 			);
	// 		}
	// 	}

	// 	// Função para desenhar a linha se a descrição mudou
	// 	function drawLineOnDescriptionChange(
	// 		pdf: any,
	// 		data: any,
	// 		rulerStartX: number,
	// 		pageWidth: number,
	// 		rulerSpacing: number,
	// 	) {
	// 		let previousDescription = '';
	// 		let previousYPosition = initialYPosition;

	// 		data.layer.forEach((layer: any, index: number) => {
	// 			const { description, depth } = layer;

	// 			// Calcula a posição Y para a profundidade atual
	// 			const currentYPosition =
	// 				initialYPosition + depth * rulerSpacing;

	// 			// Verifica se a descrição mudou
	// 			if (index > 0 && description !== previousDescription) {
	// 				// Traça uma linha no eixo X, no valor Y da profundidade anterior
	// 				pdf.setLineWidth(0.1);
	// 				pdf.line(
	// 					rulerStartX + 110, // Posição inicial X da linha
	// 					previousYPosition, // Posição Y da profundidade anterior
	// 					pageWidth - 66, // Posição final X da linha
	// 					previousYPosition, // Posição Y da profundidade anterior
	// 				);
	// 			}

	// 			// Atualiza a descrição anterior e a posição Y
	// 			previousDescription = description;
	// 			previousYPosition = currentYPosition;
	// 		});
	// 	}

	// 	function drawLayerDescriptions(
	// 		doc: jsPDF,
	// 		descriptions: string[],
	// 		startY: number,
	// 		marginLeft: number,
	// 		pageHeight: number,
	// 	) {
	// 		const lineHeight = 40; // Espaçamento total para cada linha (incluindo o espaçamento entre linhas quebradas)
	// 		const spacingBetweenLines = 3; // Espaçamento entre linhas quebradas
	// 		const spacingBetweenParagraphs = 60 - spacingBetweenLines; // Espaçamento total entre parágrafos
	// 		const textWidthLimit = 60; // Largura disponível para o texto

	// 		let currentY = startY;

	// 		for (const description of descriptions) {
	// 			// Quebra o texto se necessário
	// 			const lines = doc.splitTextToSize(description, textWidthLimit);

	// 			for (let i = 0; i < lines.length; i++) {
	// 				if (currentY + lineHeight > pageHeight) {
	// 					// Adiciona uma nova página se o conteúdo ultrapassar o limite
	// 					doc.addPage();
	// 					currentY = startY; // Reinicia a posição Y no início da nova página
	// 				}

	// 				// Desenha a linha do texto na posição Y atual
	// 				doc.text(lines[i], marginLeft + 20, currentY);

	// 				// Move para a próxima linha com o espaçamento adequado
	// 				if (i < lines.length - 1) {
	// 					// Se não for a última linha do texto, aplica o espaçamento menor entre linhas quebradas
	// 					currentY += spacingBetweenLines;
	// 				} else {
	// 					// Se for a última linha do texto, aplica o espaçamento maior entre parágrafos
	// 					currentY += spacingBetweenParagraphs;
	// 				}
	// 			}
	// 		}
	// 	}

	// 	function checkSoilDescriptionAndDrawText(
	// 		pdf: any,
	// 		data: any,
	// 		rulerStartX: number,
	// 		rulerSpacing: number,
	// 		startY: number,
	// 		printSpt: string,
	// 	) {
	// 		// Função para desenhar texto com quebras de linha
	// 		function drawSoilText(text: string, yPosition: number) {
	// 			const maxLineLength = 10; // Número máximo de caracteres por linha
	// 			const lineHeight = 3; // Espaçamento entre linhas

	// 			// Divide o texto em várias linhas com base no comprimento máximo
	// 			const textLines = text.match(
	// 				new RegExp('.{1,' + maxLineLength + '}', 'g'),
	// 			);

	// 			if (textLines) {
	// 				textLines.forEach((line: string, index: number) => {
	// 					pdf.text(
	// 						line,
	// 						rulerStartX + 111,
	// 						yPosition + index * lineHeight,
	// 					);
	// 				});
	// 			}
	// 		}

	// 		const maxDepth = Math.max(...data.layer.map((p: any) => p.depth));
	// 		let currentLayerIndex = 0;
	// 		let prevText = ''; // Armazena o texto anterior para evitar duplicação

	// 		// Loop sobre cada metro até a profundidade máxima
	// 		for (let meter = 0; meter <= maxDepth; meter++) {
	// 			const currentDepth = meter;
	// 			const nextDepth = meter + 1;

	// 			// Acessa a camada atual
	// 			let layer = data.layer[currentLayerIndex];

	// 			// Avança para a próxima camada se a profundidade atual ultrapassar a profundidade da camada
	// 			while (layer && currentDepth >= layer.depth) {
	// 				currentLayerIndex++;
	// 				layer = data.layer[currentLayerIndex];
	// 			}

	// 			// Se não houver mais camadas, saia do loop
	// 			if (!layer) {
	// 				break;
	// 			}

	// 			// Desestrutura os dados da camada
	// 			const { description, hit2, hit3 } = layer;
	// 			const hitSum = (hit2 ?? 0) + (hit3 ?? 0);
	// 			let soilText = '';

	// 			// Classificação para solos arenosos e siltosos
	// 			if (
	// 				description.includes('AREIA FINA ARENOSA') ||
	// 				description.includes('AREIA FINA SILTOSA') ||
	// 				description.includes('AREIA FINA ARGILOSA') ||
	// 				description.includes('SILTE ARENOSO') ||
	// 				description.includes('SILTE SILTOSO')
	// 			) {
	// 				if (hitSum <= 4) {
	// 					soilText = 'Fofa(o)';
	// 				} else if (hitSum >= 5 && hitSum <= 8) {
	// 					soilText = 'Pouco compacta(o)';
	// 				} else if (hitSum >= 9 && hitSum <= 18) {
	// 					soilText = 'Medianamente compacta(o)';
	// 				} else if (hitSum >= 19 && hitSum <= 40) {
	// 					soilText = 'Compacta(o)';
	// 				} else if (hitSum > 40) {
	// 					soilText = 'Muito compacta(o)';
	// 				}
	// 			}
	// 			// Classificação para solos argilosos
	// 			else if (
	// 				description.includes('SILTE ARGILOSO.') ||
	// 				description.includes(
	// 					'ARGILA ARENOSA, COR VERMELHA ESCURA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA ARENOSA (ARENITO), COR VERMELHA CLARA COM MANCHAS CINZA CLARA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA E CINZA ESCURA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA ARENOSA, COR VERMELHA CLARA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA SILTOSA, COR VERMELHA CLARA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA SILTOSA, COR VERMELHA CLARA COM MANCHAS CINZA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA SILTOSA, COR VERMELHA ESCURA COM MANCHAS CINZA ESCURA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA SILTOSA, COR VERMELHA ESCURA.',
	// 				) ||
	// 				description.includes(
	// 					'ARGILA SILTOSA COM SEIXOS, COR VERMELHA CLARA.',
	// 				) ||
	// 				description.includes('ARGILA ARGILOSA.')
	// 			) {
	// 				if (hitSum <= 2) {
	// 					soilText = 'Muito mole';
	// 				} else if (hitSum >= 3 && hitSum <= 5) {
	// 					soilText = 'Mole';
	// 				} else if (hitSum >= 6 && hitSum <= 10) {
	// 					soilText = 'Média(o)';
	// 				} else if (hitSum >= 11 && hitSum <= 19) {
	// 					soilText = 'Rija(o)';
	// 				} else if (hitSum > 19) {
	// 					soilText = 'Dura(o)';
	// 				}
	// 			}

	// 			const yPosition = startY + (meter + 0.5) * rulerSpacing;

	// 			// Lógica de printSpt
	// 			if (meter === 0 && printSpt === 'N') {
	// 				pdf.setFillColor(255, 255, 255); // Cor branca

	// 				pdf.rect(rulerStartX + 50, yPosition - 5, 50, 10, 'F');

	// 				pdf.rect(rulerStartX + 130, yPosition - 5, 20, 10, 'F');

	// 				pdf.rect(rulerStartX + 190, yPosition - 5, 30, 10, 'F');

	// 				continue;
	// 			}

	// 			if (soilText !== prevText) {
	// 				pdf.setFillColor(255, 255, 255);
	// 				pdf.rect(
	// 					rulerStartX + 110.301,
	// 					yPosition + 3,
	// 					17.5,
	// 					25,
	// 					'F',
	// 				);

	// 				pdf.setFontSize(8);
	// 				drawSoilText(soilText, yPosition + 12);

	// 				pdf.setFillColor(255, 255, 255);
	// 				pdf.setDrawColor('#fff');
	// 				pdf.rect(
	// 					rulerStartX + 110.301,
	// 					yPosition + 3,
	// 					17.5,
	// 					50,
	// 					'F',
	// 				);

	// 				prevText = soilText;
	// 			}

	// 			if (nextDepth >= layer.depth) {
	// 				currentLayerIndex++;
	// 			}
	// 		}

	// 		// Adicionar as linhas horizontais e descrições finais
	// 		// drawHorizontalLines(
	// 		// 	pdf,
	// 		// 	rulerStartX,
	// 		// 	pageWidth,
	// 		// 	rulerSpacing,
	// 		// 	startY,
	// 		// 	pageHeight / rulerSpacing,
	// 		// );
	// 		// drawLineOnDescriptionChange(
	// 		// 	pdf,
	// 		// 	data,
	// 		// 	rulerStartX,
	// 		// 	pageWidth,
	// 		// 	rulerSpacing,
	// 		// );
	// 		// drawLayerDescriptions(
	// 		// 	pdf,
	// 		// 	data,
	// 		// 	rulerStartX,
	// 		// 	rulerSpacing,
	// 		// 	pageHeight,
	// 		// 	startY,
	// 		// 	initialDepth,
	// 		// );
	// 	}

	// 	// Função para desenhar o texto com base no número de dígitos
	// 	function drawTextBasedOnDigits(
	// 		pdf: any,
	// 		value: number,
	// 		initialX: number,
	// 		adjustedYPosition: number,
	// 	) {
	// 		// Converte o valor numérico para string
	// 		const valueStr = value.toString();

	// 		// Verifica se o valor tem 2 dígitos ou mais e ajusta o X
	// 		const adjustedXPosition =
	// 			valueStr.length === 2 ? initialX + 5 : initialX + 6;

	// 		// Desenha o texto no PDF com o X ajustado
	// 		pdf.text(valueStr, adjustedXPosition, adjustedYPosition);
	// 	}

	// 	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 	//CHAMADA DAS FUNÇÕES
	// 	const totalMeters = pageHeight; // Defina quantos metros quer renderizar
	// 	drawHorizontalLines(
	// 		doc,
	// 		rulerStartX,
	// 		pageWidth,
	// 		rulerSpacing,
	// 		initialYPosition,
	// 		totalMeters,
	// 	); // Ajuste totalMeters conforme necessário

	// 	drawLineOnDescriptionChange(
	// 		doc,
	// 		data,
	// 		rulerStartX,
	// 		pageWidth,
	// 		rulerSpacing,
	// 	);
	// 	drawLayerDescriptions(
	// 		doc,
	// 		listDescriptions,
	// 		startY + 5,
	// 		40,
	// 		pageHeight,
	// 	);

	// 	checkSoilDescriptionAndDrawText(
	// 		doc,
	// 		data,
	// 		rulerStartX,
	// 		rulerSpacing,
	// 		startY,
	// 		data.printSpt,
	// 	);

	// 	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// 	doc.setFontSize(8);
	// 	doc.setFont('Times New Roman', 'normal');

	// 	// Definir posição Y inicial para o texto à esquerda
	// 	let yPosition = 5; // Posição Y inicial sem margem

	// 	//////////////////////////////////////////////////////////////////////////
	// 	// Desenhar o texto à esquerda
	// 	// doc.text(`Cliente: ${data.username}`, marginLeft, yPosition);
	// 	doc.text(`Cliente: `, marginLeft, yPosition);
	// 	doc.setFontSize(12);
	// 	doc.setFont('Times New Roman', 'bold');
	// 	doc.text(`${data.username}`, marginLeft + 13, yPosition);
	// 	yPosition += lineSpacing;
	// 	//////////////////////////////////////////////////////////////////////////

	// 	//////////////////////////////////////////////////////////////////////////
	// 	// doc.text(`Obra: ${data.obra}`, marginLeft, yPosition);
	// 	doc.setFontSize(8);
	// 	doc.setFont('Times New Roman', 'normal');
	// 	doc.text(`Obra: `, marginLeft, yPosition);
	// 	doc.setFontSize(12);
	// 	doc.text(`${data.obra} `, marginLeft + 13, yPosition);
	// 	yPosition += lineSpacing;
	// 	//////////////////////////////////////////////////////////////////////////

	// 	//////////////////////////////////////////////////////////////////////////
	// 	doc.setFontSize(8);
	// 	doc.setFont('Times New Roman', 'normal');
	// 	// doc.text(`Local: ${data.local}`, marginLeft, yPosition);
	// 	doc.text(`Local:`, marginLeft, yPosition);
	// 	doc.setFontSize(12);
	// 	doc.text(` ${data.local}`, marginLeft + 12, yPosition);
	// 	yPosition += lineSpacing;
	// 	////////////////////////////////////////////////////////////////////////

	// 	// Desenhar separador vertical à direita
	// 	doc.setDrawColor('#000');
	// 	doc.setLineWidth(0.2);

	// 	doc.line(separatorX, 0, separatorX, pageHeight); // Linha vertical da parte superior até a parte inferior da página

	// 	// Ajustar a posição Y inicial para os textos à direita, começando ao lado do separador
	// 	let rightYPosition = 5; // Começar alinhado com o topo do primeiro texto à esquerda

	// 	// Texto à direita
	// 	doc.setFontSize(12);
	// 	doc.setFont('Times New Roman', 'bold');
	// 	doc.text('SONDAGEM A PERCUSSÃO', separatorX + 2, rightYPosition, {
	// 		align: 'left',
	// 	});
	// 	rightYPosition += lineSpacing;

	// 	doc.setFontSize(12);
	// 	doc.setFont('Times New Roman', 'bold');
	// 	doc.text(data.furo.toUpperCase(), separatorX + 2, rightYPosition, {
	// 		align: 'left',
	// 	});
	// 	rightYPosition += lineSpacing;

	// 	doc.setFont('Times New Roman', 'bold');
	// 	doc.text(`COTA ${data.cota}`, separatorX + 2, rightYPosition, {
	// 		align: 'left',
	// 	});
	// 	rightYPosition += lineSpacing;

	// 	doc.setFontSize(8); // Menor tamanho da fonte para datas
	// 	doc.setFont('Times New Roman', 'normal');

	// 	const dataInicio = new Date(data.dataInicio).toLocaleDateString(
	// 		'pt-BR',
	// 	);
	// 	const dataFinal = new Date(data.dataFinal).toLocaleDateString('pt-BR');

	// 	const dateText = `Data de início: ${dataInicio}  Término: ${dataFinal}`;
	// 	doc.text(dateText, separatorX + 2, rightYPosition, { align: 'left' });
	// 	rightYPosition += lineSpacing;

	// 	// Desenhar linha vertical da base dos textos até a parte inferior da página
	// 	doc.setLineWidth(0.2);

	// 	doc.line(
	// 		separatorX,
	// 		rightYPosition - lineSpacing,
	// 		separatorX,
	// 		pageHeight,
	// 	); // Linha vertical da base dos textos até o fundo da página

	// 	// Desenhar linha vertical à esquerda
	// 	doc.setLineWidth(0.2);
	// 	doc.line(marginLeft + 15, 22, marginLeft + 15, pageHeight); // Linha vertical da parte superior até a parte inferior da página

	// 	// Desenhar coluna da régua
	// 	let rulerYPosition = 50; // Começar na posição Y 50 para a régua

	// 	doc.line(marginLeft + 15, 22, marginLeft + 15, 22);
	// 	doc.text('COTA (m)', marginLeft, 35);

	// 	// Adicionar linha horizontal na posição indicada
	// 	const lineYPosition = 50; // Ajuste a posição Y conforme necessário
	// 	doc.setLineWidth(0.2);
	// 	doc.line(
	// 		marginLeft + 15,
	// 		lineYPosition,
	// 		pageWidth - marginRight,
	// 		lineYPosition,
	// 	); // Linha horizontal da margem esquerda até a margem direita

	// 	// Desenhar coluna perfil geológico
	// 	doc.line(marginLeft + 35, 22, marginLeft + 35, pageHeight);
	// 	doc.text('PERFIL', marginLeft + 19, 35);
	// 	doc.text('GEOLÓGICO', marginLeft + 16, 39);

	// 	//Desenhar coluna profundidade camada
	// 	doc.line(marginLeft + 55, 22, marginLeft + 55, pageHeight);
	// 	doc.text('PROFUNDI-', marginLeft + 37, 35);
	// 	doc.text('DADE', marginLeft + 37, 39);
	// 	doc.text('CAMADA (m)', marginLeft + 37, 43);

	// 	//Desenhar coluna classificação da camada
	// 	doc.line(marginLeft + 125, 22, marginLeft + 125, pageHeight);
	// 	doc.text('AMOSTRADOR:', marginLeft + 60, 26);
	// 	doc.text('TERZA GHI & PECK ', marginLeft + 82, 26);

	// 	doc.text('Ø INTERNO:', marginLeft + 60, 30);
	// 	doc.text('34,9 mm', marginLeft + 78, 30);

	// 	doc.text('Ø EXTERNO:', marginLeft + 60, 34);
	// 	doc.text('50,8 mm', marginLeft + 78, 34);

	// 	doc.text('REVESTIMENTO:', marginLeft + 60, 38);
	// 	doc.text('63,5 mm', marginLeft + 84, 38);

	// 	doc.text('PESO:', marginLeft + 95, 30);
	// 	doc.text('65 kg', marginLeft + 105, 30);

	// 	doc.text('ALTURA QUEDA:', marginLeft + 92, 34);
	// 	doc.text('75 cm', marginLeft + 115, 34);

	// 	doc.line(marginLeft + 55, 39, marginLeft + 125, 39);
	// 	doc.setFontSize(10);
	// 	doc.setFont('Times New Roman', 'bold');
	// 	doc.text('CLASSIFICAÇÃO DA CAMADA', marginLeft + 59, 45);

	// 	//Desenhar coluna consistência ou compacidade
	// 	doc.setFontSize(8); // Menor tamanho da fonte para datas
	// 	doc.setFont('Times New Roman', 'normal');
	// 	doc.text('CONSIS-', marginLeft + 128, 28);
	// 	doc.text('TÊNCIA', marginLeft + 128, 32);
	// 	doc.text('E', marginLeft + 132, 36);
	// 	doc.text('COMPA-', marginLeft + 128, 40);
	// 	doc.text('CIDADE', marginLeft + 128, 44);

	// 	//Desenhar coluna número de golpes
	// 	doc.line(marginLeft + 165, 22, marginLeft + 165, pageHeight);
	// 	doc.text('NÚMERO DE', marginLeft + 145, 35);
	// 	doc.text('GOLPES', marginLeft + 145, 39);

	// 	//Desenhar coluna resistência a penetração
	// 	doc.setLineWidth(0.1);
	// 	doc.setDrawColor(150, 150, 150);
	// 	doc.line(marginLeft + 168, 50, marginLeft + 168, pageHeight);

	// 	const step = 10; // Altura de 1 metro em mm (ajuste conforme necessário)

	// 	// Agora desenha os retângulos que marcam metro por metro
	// 	let currentY = 50; // Posição inicial
	// 	let isBlue = false; // Alterna entre branco e azul

	// 	while (currentY < pageHeight) {
	// 		if (isBlue) {
	// 			// Retângulo azul
	// 			doc.setFillColor(0, 0, 255); // Cor azul
	// 		} else {
	// 			// Retângulo branco
	// 			doc.setFillColor(255, 255, 255); // Cor branca
	// 		}

	// 		// // Desenha o retângulo verticalmente (uma coluna)
	// 		// doc.rect(marginLeft + 165, currentY, 2.8, step, 'F'); // Retângulo entre as linhas de 10 e 20 mm

	// 		// Atualiza a posição Y para o próximo metro
	// 		currentY += step;
	// 		isBlue = !isBlue; // Alterna a cor para o próximo metro
	// 	}

	// 	doc.setDrawColor(150, 150, 150);
	// 	doc.line(marginLeft + 165, 50, marginLeft + 171, pageHeight);
	// 	doc.line(marginLeft + 171, 50, marginLeft + 171, pageHeight);
	// 	doc.line(marginLeft + 174, 50, marginLeft + 174, pageHeight);
	// 	doc.line(marginLeft + 177, 50, marginLeft + 177, pageHeight);
	// 	doc.line(marginLeft + 180, 50, marginLeft + 180, pageHeight);
	// 	doc.line(marginLeft + 183, 50, marginLeft + 183, pageHeight);
	// 	doc.line(marginLeft + 186, 50, marginLeft + 186, pageHeight);
	// 	doc.line(marginLeft + 189, 50, marginLeft + 189, pageHeight);
	// 	doc.line(marginLeft + 192, 50, marginLeft + 192, pageHeight);
	// 	doc.line(marginLeft + 195, 50, marginLeft + 195, pageHeight);
	// 	doc.line(marginLeft + 198, 22, marginLeft + 198, pageHeight);
	// 	doc.setDrawColor(0, 0, 0);

	// 	doc.text('RESISTÊNCIA A', marginLeft + 170, 26);
	// 	doc.text('PENETRAÇÃO', marginLeft + 170, 30);
	// 	doc.line(marginLeft + 165, 32, marginLeft + 197, 32);

	// 	doc.text('AMOSTRADOR TIPO', marginLeft + 167, 35);
	// 	doc.text('TERZAGHI & PECK', marginLeft + 167, 39);
	// 	doc.line(marginLeft + 165, 40, marginLeft + 197, 40);

	// 	doc.text('S.P.T', marginLeft + 178, 44);
	// 	doc.line(marginLeft + 165, 45, marginLeft + 197, 45);

	// 	doc.text('10 20 30 40', marginLeft + 173, 49);

	// 	//Desenhar coluna N.A
	// 	doc.text('N.A.', marginLeft + 201, 36);

	// 	// Desenhar régua na coluna da esquerda
	// 	doc.setLineWidth(0.2);
	// 	doc.setFontSize(8);

	// 	// Definir espaçamentos e dimensões

	// 	// Desenhar a régua
	// 	// O valor inicial da régua deve ser o final da página anterior (ex: 13)
	// 	let currentDepth = 17 || 0; // Inicia na profundidade anterior ou 0 se for a primeira página

	// 	// Definir a posição inicial Y para a nova página
	// 	const longLineLength = 10;
	// 	const mediumLineLength = 6;
	// 	const shortLineLength = 3;

	// 	console.log(`Iniciando a régua na profundidade: ${currentDepth}`);

	// 	// Desenhar a régua a partir da profundidade final da página anterior
	// 	for (let i = 0; rulerYPosition < pageHeight; i++) {
	// 		let lineLength = 0;
	// 		let depthText = '';

	// 		if (i === 0 || i % 5 === 0) {
	// 			lineLength = longLineLength;
	// 			depthText = currentDepth.toFixed(2); // Texto de profundidade formatado
	// 			doc.text(depthText, rulerStartX - 13, rulerYPosition - 2);
	// 			console.log(
	// 				`Desenhando cota: ${depthText} na posição Y: ${rulerYPosition}`,
	// 			);
	// 		} else if (i % 1 === 0) {
	// 			lineLength = shortLineLength;
	// 		} else {
	// 			lineLength = mediumLineLength;
	// 		}

	// 		doc.setLineWidth(0.2);
	// 		doc.line(
	// 			rulerStartX - lineLength,
	// 			rulerYPosition,
	// 			rulerStartX,
	// 			rulerYPosition,
	// 		);

	// 		// Incrementa a profundidade e a posição Y para cada linha
	// 		currentDepth += 1;
	// 		rulerYPosition += rulerSpacing;
	// 	}

	// 	// Desenhar as linhas de profundidade a partir de onde a régua terminou
	// 	data.profundidadeCamada.forEach((depth: number) => {
	// 		// Calcular a posição Y para a profundidade
	// 		const depthYPosition = startY + (depth - 17) * rulerSpacing;

	// 		console.log(
	// 			`Profundidade: ${depth}, Posição Y calculada: ${depthYPosition}`,
	// 		);

	// 		// Ajustar a profundidade se estiver fora do intervalo visível
	// 		if (depthYPosition < startY) {
	// 			console.log(
	// 				`Profundidade ${depth} abaixo da posição inicial da régua`,
	// 			);
	// 		} else if (depthYPosition > pageHeight) {
	// 			console.log(`Profundidade ${depth} acima do limite da página`);
	// 			return; // Sai do loop se a profundidade estiver fora do limite
	// 		} else {
	// 			doc.setLineWidth(0.2);
	// 			doc.line(
	// 				rulerStartX,
	// 				depthYPosition,
	// 				pageWidth - 84,
	// 				depthYPosition,
	// 			);

	// 			doc.setFontSize(10);
	// 			doc.text(
	// 				depth.toString(),
	// 				rulerStartX + 28,
	// 				depthYPosition - 0.5,
	// 			);

	// 			console.log(
	// 				`Linha de profundidade ${depth} traçada na posição Y: ${depthYPosition}`,
	// 			);
	// 		}
	// 	});

	// 	// Itera sobre as profundidades e desenha no PDF
	// 	// Verifica se o índice 1 de listHits é um array e contém objetos

	// 	if (Array.isArray(listHits[1])) {
	// 		const profundities = listHits[1]; // Acessa o array no índice 1

	// 		// Itera sobre cada objeto no array do índice 1
	// 		for (let index = 0; index < profundities.length; index++) {
	// 			const profundity = profundities[index]; // Acessa o objeto no índice atual

	// 			console.log('Item no índice', index, ':', profundity);

	// 			// Ajusta a posição Y com base no índice
	// 			const adjustedYPosition = startY + 5 + index * rulerSpacing;

	// 			doc.setFontSize(8);

	// 			// Desenha os elementos conforme necessário
	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.hit1,
	// 				initialX - 6,
	// 				adjustedYPosition,
	// 			);
	// 			doc.setLineWidth(0.2);
	// 			doc.line(
	// 				initialX - 1,
	// 				adjustedYPosition + 0.3,
	// 				initialX + 2,
	// 				adjustedYPosition + 0.3,
	// 			);
	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.profundity1,
	// 				initialX - 6,
	// 				adjustedYPosition + 3,
	// 			);

	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.hit2,
	// 				initialX,
	// 				adjustedYPosition,
	// 			);
	// 			doc.setLineWidth(0.2);
	// 			doc.line(
	// 				initialX + 5,
	// 				adjustedYPosition + 0.3,
	// 				initialX + 8,
	// 				adjustedYPosition + 0.3,
	// 			);
	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.profundity2,
	// 				initialX,
	// 				adjustedYPosition + 3,
	// 			);

	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.hit3,
	// 				initialX + 6,
	// 				adjustedYPosition,
	// 			);
	// 			doc.setLineWidth(0.2);
	// 			doc.line(
	// 				initialX + 11,
	// 				adjustedYPosition + 0.3,
	// 				initialX + 14,
	// 				adjustedYPosition + 0.3,
	// 			);
	// 			drawTextBasedOnDigits(
	// 				doc,
	// 				profundity.profundity3,
	// 				initialX + 6,
	// 				adjustedYPosition + 3,
	// 			);

	// 			console.log('hit1:', profundity.hit1);
	// 			console.log('hit2:', profundity.hit2);
	// 			console.log('hit3:', profundity.hit3);
	// 			console.log('profundity1:', profundity.profundity1);
	// 			console.log('profundity2:', profundity.profundity2);
	// 			console.log('profundity3:', profundity.profundity3);

	// 			// Defina as variáveis da marcação
	// 			const lineOffsets = [
	// 				marginLeft + 149, // Posição para 0-5
	// 				marginLeft + 152, // Posição para 5-10
	// 				marginLeft + 155, // Posição para 10-15
	// 				marginLeft + 158, // Posição para 15-20
	// 				marginLeft + 161, // Posição para 20-25
	// 				marginLeft + 164, // Posição para 25-30
	// 				marginLeft + 167, // Posição para 30-35
	// 				marginLeft + 170, // Posição para 35-40
	// 				marginLeft + 173, // Posição para 40-45
	// 				marginLeft + 176, // Posição para 45-50
	// 			];

	// 			// Desenhar a linha de base
	// 			const startX = marginLeft + 165; // Alinhar o início da régua ao `marginLeft`
	// 			const endX = marginLeft + 198; // Alinhar o fim da régua à última posição
	// 			const yBase = 50; // Posição base no eixo Y
	// 			doc.setLineWidth(0.1);
	// 			doc.setDrawColor(0, 0, 0); // Preto
	// 			doc.line(startX, yBase, endX, yBase);

	// 			// Armazenar as posições das marcações
	// 			const result = profundity.hit2! + profundity.hit3!;

	// 			// Determinar o índice da coluna mais próxima
	// 			const nearestLineIndex = Math.min(
	// 				Math.floor(result / lineSpacing), // Usar `result` para determinar a coluna correta
	// 				lineOffsets.length - 1,
	// 			);

	// 			const nearestLinePosition = lineOffsets[nearestLineIndex];
	// 			const nextLinePosition =
	// 				lineOffsets[nearestLineIndex + 1] ||
	// 				nearestLinePosition + lineSpacing;
	// 			const positionWithinColumn =
	// 				(result % lineSpacing) / lineSpacing;
	// 			const markPosition =
	// 				nearestLinePosition +
	// 				positionWithinColumn *
	// 					(nextLinePosition - nearestLinePosition);

	// 			console.log(markPosition);

	// 			// Adicionar a posição da marcação para a linha
	// 			markPositions.push({
	// 				x: markPosition + 19,
	// 				y: adjustedYPosition,
	// 			});

	// 			const resultProfundity =
	// 				profundity.profundity2! + profundity.profundity3!;
	// 			if (result !== 0) {
	// 				// Desenhar a marcação
	// 				doc.setFont('Times New Roman', 'normal');
	// 				doc.setFontSize(10);
	// 				doc.text(
	// 					result.toString(),
	// 					markPosition + 20,
	// 					adjustedYPosition + 1,
	// 				); // Ajuste a posição Y conforme necessário
	// 				if (resultProfundity !== 30) {
	// 					doc.text(
	// 						`/${resultProfundity}`,
	// 						markPosition + 22,
	// 						adjustedYPosition + 1,
	// 					); // Ajuste a posição Y conforme necessário
	// 				}
	// 			}
	// 		}
	// 	}

	// 	// doc.setFillColor(255, 255, 255);
	// 	// doc.setDrawColor('#fff');
	// 	// doc.rect(marginLeft + 166, 50, 19, 19, 'FD');

	// 	data.layer.forEach((layer: any, index: number) => {
	// 		console.log(`Layer ${index} Image:`, layer.backgroundImage);
	// 		// Desenha quadrado para cada intervalo de metro
	// 		const previousDepth = index === 0 ? 0 : data.layer[index - 1].depth;
	// 		const currentDepth = layer.depth;

	// 		const imgHeight =
	// 			(layer.depth -
	// 				(index === 0 ? 0 : data.layer[index - 1].depth)) *
	// 				rulerSpacing -
	// 			0.8;
	// 		const adjustedHeight = Math.max(imgHeight, 0);
	// 		const imgY =
	// 			startY +
	// 			(index === 0 ? 0 : data.layer[index - 1].depth) * rulerSpacing;
	// 		const imgX = marginLeft + 15.5;
	// 		const squareWidth = 20;
	// 		const imgWidth = squareWidth;

	// 		// Adicionando a imagem ao PDF
	// 		if (layer.backgroundImage.startsWith('data:image/png;base64,')) {
	// 			console.log(`Adicionando imagem da camada ${index} no PDF.`);
	// 			doc.addImage(
	// 				layer.backgroundImage,
	// 				'PNG',
	// 				imgX,
	// 				imgY + 0.5,
	// 				imgWidth - 1,
	// 				adjustedHeight,
	// 			);
	// 		} else {
	// 			console.error(`Layer ${index} não tem uma imagem PNG válida.`);
	// 		}

	// 		for (
	// 			let meter = Math.ceil(previousDepth);
	// 			meter <= Math.floor(currentDepth);
	// 			meter++
	// 		) {
	// 			// Desenhando quadrado seguindo as metragens da régua
	// 			doc.setDrawColor(0); // Cor do contorno (0 = preto)
	// 			doc.setFillColor(255, 255, 255); // Cor de preenchimento (branco)
	// 			// Calcula a posição Y centralizada no meio do metro (ex: 0.5, 1.5, etc.)
	// 			const squareY = startY + meter * rulerSpacing - 5;

	// 			// Desenha o quadrado
	// 			doc.rect(
	// 				marginLeft + 22,
	// 				////////////////////////////////////////////////////////////////
	// 				squareY + 5,
	// 				////////////////////////////////////////////////////////////////
	// 				imgWidth - 16,
	// 				rulerSpacing / 2 - 4,
	// 				'FD',
	// 			); // Quadrado pequeno

	// 			// Coloca a numeração dentro do quadrado
	// 			doc.setFontSize(8);
	// 			doc.text(
	// 				String(meter),
	// 				marginLeft + 23,
	// 				/////////////////////////////////////////////////////////////
	// 				squareY + rulerSpacing / 4 + 4,
	// 				/////////////////////////////////////////////////////////////
	// 			);
	// 		}
	// 	});

	// 	/////////////////////////////////////////////////////////////////////
	// 	doc.setLineWidth(0.8);
	// 	doc.line(marginLeft + 15, 50, marginLeft + 15, 80);
	// 	doc.line(marginLeft + 35, 50, marginLeft + 35, 80);
	// 	doc.setLineWidth(0.1);

	// 	///////////////////////////////////////////////////////////////////

	// 	for (let i = 0; i < markPositions.length - 1; i++) {
	// 		doc.setDrawColor('red');
	// 		const start = markPositions[i];
	// 		const end = markPositions[i + 1];
	// 		doc.line(start.x, start.y, end.x, end.y);
	// 	}

	// 	// Desenhar linha horizontal completa na parte inferior, abaixo dos textos
	// 	const lineY = rightYPosition + lineSpacing - 8; // Posição Y da linha horizontal, abaixo do texto
	// 	doc.setLineWidth(0.1);
	// 	doc.setDrawColor('#000');
	// 	doc.line(marginLeft, lineY, pageWidth - marginRight, lineY); // Linha horizontal da margem esquerda até a margem direita

	// 	//////////////////////////////////////////////////////////////////////
	// 	doc.setFillColor(255, 255, 255);
	// 	doc.rect(marginLeft + 21, 73, 6, 3, 'FD');
	// 	doc.text('2,00', marginLeft + 21.5, 75.5);
	// 	//////////////////////////////////////////////////////////////////

	// 	doc.addImage(
	// 		data.footer,
	// 		'PNG',
	// 		marginLeft,
	// 		lineY + 237,
	// 		pageWidth - marginRight,
	// 		lineY + 16,
	// 	);

	// 	doc.addImage(
	// 		data.na,
	// 		'PNG',
	// 		marginLeft + 200,
	// 		pageHeight / 2 - 40,
	// 		8,
	// 		8,
	// 	);
	// 	doc.text(`15,67`, marginLeft + 200, pageHeight / 2 - 43);

	// 	doc.text(
	// 		'Mole',
	// 		rulerStartX + 115, // Posição X
	// 		85,
	// 	);

	// 	doc.text(
	// 		'Média(o)',
	// 		rulerStartX + 113, // Posição X
	// 		150,
	// 	);
	// 	doc.line(rulerStartX + 110, 168, rulerStartX + 128, 168);
	// 	doc.text(
	// 		'Rija(o)',
	// 		rulerStartX + 115, // Posição X
	// 		220,
	// 	);

	// 	doc.setDrawColor('#fff');
	// 	doc.setFillColor(255, 255, 255);
	// 	doc.rect(rulerStartX + 110.2, 122, 17.5, 5, 'FD');
	// };
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------//

	const drawFirstPage = (
		pdf: any,
		data: any,
		startY: number,
		rulerSpacing: number,
		pageHeight: number,
		rulerStartX: number,
		pageWidth: number,
	) => {
		//FUNÇÕES

		// Função para desenhar as linhas horizontais marcando os metros
		function drawHorizontalLines(
			pdf: any,
			rulerStartX: number,
			pageWidth: number,
			rulerSpacing: number,
			startY: number,
			totalMeters: number,
		) {
			for (let i = 0; i <= totalMeters; i++) {
				// Calcula a posição Y para cada metro na régua (1, 2, 3, etc.)
				const yPosition = startY + i * rulerSpacing;

				pdf.setLineWidth(0.1);
				pdf.line(
					rulerStartX + 110,
					yPosition,
					pageWidth - 66,
					yPosition,
				);
			}
		}

		// Função para desenhar a linha se a descrição mudou
		function drawLineOnDescriptionChange(
			pdf: any,
			data: any,
			rulerStartX: number,
			pageWidth: number,
			rulerSpacing: number,
		) {
			let previousDescription = '';
			let previousYPosition = 0;

			data.layer.forEach((layer: any, index: number) => {
				const { description, depth } = layer;

				// Calcula a posição Y para a profundidade atual
				const currentYPosition = startY + depth * rulerSpacing;

				// Verifica se a descrição mudou
				if (index > 0 && description !== previousDescription) {
					// Traça uma linha no eixo X, no valor Y da profundidade anterior
					pdf.setLineWidth(0.1);
					pdf.line(
						rulerStartX + 110, // Posição inicial X da linha
						previousYPosition, // Posição Y da profundidade anterior
						pageWidth - 66, // Posição final X da linha
						previousYPosition, // Posição Y da profundidade anterior
					);
				}

				// Atualiza a descrição anterior e a posição Y
				previousDescription = description;
				previousYPosition = currentYPosition;
				previousYPositionGlobal = currentYPosition;
			});
		}

		function drawLayerDescriptions(
			pdf: any,
			data: any,
			rulerStartX: number,
			rulerSpacing: number,
			pageHeight: number,
			startY: number,
			finalDepth: number,
		) {
			const layers = data.layer.sort(
				(a: any, b: any) => a.depth - b.depth,
			);
			const maxLineLength = 39;
			const lineHeight = 5;
			pdf.setFontSize(8);
			const pageMargin = 20;
			const currentYPosition = startY;

			let lastRenderedDepth: null = null; // Última profundidade renderizada
			let lastRenderedDescription: null = null; // Última descrição renderizada
			let secondLastRenderedDepth = null; // Penúltima profundidade renderizada
			let secondLastRenderedDescription = null; // Penúltima descrição renderizada

			layers.forEach((layer: any, index: number) => {
				const { depth, description } = layer;
				const prevDepth = index === 0 ? 0 : layers[index - 1].depth;
				const currentDepth = depth;
				const yPosition =
					currentYPosition +
					((prevDepth + currentDepth) / 2) * rulerSpacing;
				listDescriptions.push(description);

				if (yPosition >= 0 && yPosition <= pageHeight - pageMargin) {
					const textLines = description.match(
						new RegExp('.{1,' + maxLineLength + '}', 'g'),
					);

					if (textLines) {
						const textHeightApprox = lineHeight * textLines.length;
						const yCenteredPosition =
							yPosition - textHeightApprox / 2;

						pdf.setFillColor(255, 255, 255); // Cor branca
						textLines.forEach((line: string, lineIndex: number) => {
							const textWidth = pdf.getTextWidth(line);
							const xPosition =
								rulerStartX + (200 - textWidth) / 2;

							pdf.text(
								line,
								xPosition - 25,
								yCenteredPosition + lineIndex * lineHeight + 3,
							);
						});

						// Atualize os valores atuais
						lastRenderedDepth = currentDepth;
						lastRenderedDescription = description;
						// Atualize os valores penúltimos antes de sobrescrevê-los
						secondLastRenderedDepth = lastRenderedDepth;
						secondLastRenderedDescription = lastRenderedDescription;
					}
				} else {
					console.warn(
						`Profundidade ${depth} fora do intervalo visível`,
					);
				}
			});

			// Log dos valores penúltimos após o loop
			console.log(
				`Penúltima profundidade renderizada: ${secondLastRenderedDepth}, Penúltima descrição: ${secondLastRenderedDescription}`,
			);
			listDescriptions.splice(0, 7);
		}

		function checkSoilDescriptionAndDrawText(
			pdf: any,
			data: any,
			rulerStartX: number,
			rulerSpacing: number,
			startY: number,
			printSpt: string, // Recebendo o printSpt como argumento
		) {
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
						pdf.text(
							line,
							rulerStartX + 111,
							yPosition + index * lineHeight,
						);
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
				const { description, hit2, hit3 } = layer;
				const hitSum = (hit2 ?? 0) + (hit3 ?? 0);
				let soilText = '';

				// // Classificação para solos arenosos e siltosos
				// if (
				// 	description.includes('AREIA FINA ARENOSA') ||
				// 	description.includes('AREIA FINA SILTOSA') ||
				// 	description.includes('AREIA FINA ARGILOSA') ||
				// 	description.includes('SILTE ARENOSO') ||
				// 	description.includes('SILTE SILTOSO')
				// ) {
				// 	// Regras para solos arenosos e siltosos baseadas na soma dos hits
				// 	if (hitSum <= 4) {
				// 		soilText = 'Fofa(o)';
				// 	} else if (hitSum >= 5 && hitSum <= 8) {
				// 		soilText = 'Pouco compacta(o)';
				// 	} else if (hitSum >= 9 && hitSum <= 18) {
				// 		soilText = 'Medianamente compacta(o)';
				// 	} else if (hitSum >= 19 && hitSum <= 40) {
				// 		soilText = 'Compacta(o)';
				// 	} else if (hitSum > 40) {
				// 		soilText = 'Muito compacta(o)';
				// 	}
				// }
				// // Classificação para solos argilosos
				// else if (
				// 	description.includes('SILTE ARGILOSO') ||
				// 	description.includes('ARGILA ARENOSA') ||
				// 	description.includes('ARGILA SILTOSA') ||
				// 	description.includes('ARGILA ARGILOSA')
				// ) {
				// 	// Regras para solos argilosos baseadas na soma dos hits
				// 	if (hitSum <= 2) {
				// 		soilText = 'Muito mole';
				// 	} else if (hitSum >= 3 && hitSum <= 5) {
				// 		soilText = 'Mole';
				// 	} else if (hitSum >= 6 && hitSum <= 10) {
				// 		soilText = 'Média(o)';
				// 	} else if (hitSum >= 11 && hitSum <= 19) {
				// 		soilText = 'Rija(o)';
				// 	} else if (hitSum > 19) {
				// 		soilText = 'Dura(o)';
				// 	}
				// }

				// Classificação para solos arenosos e siltosos
				if (
					description.includes('AREIA FINA ARENOSA') ||
					description.includes('AREIA FINA SILTOSA') ||
					description.includes('AREIA FINA ARGILOSA') ||
					description.includes('SILTE ARENOSO') ||
					description.includes('SILTE SILTOSO')
				) {
					// Regras para solos arenosos e siltosos baseadas na soma dos hits
					if (hitSum <= 4) {
						soilText = 'Fofa(o)';
					} else if (hitSum >= 5 && hitSum <= 8) {
						soilText = 'Pouco compacta(o)';
					} else if (hitSum >= 9 && hitSum <= 18) {
						soilText = 'Medianamente compacta(o)';
					} else if (hitSum >= 19 && hitSum <= 40) {
						soilText = 'Compacta(o)';
					} else if (hitSum > 40) {
						soilText = 'Muito compacta(o)';
					}
				}
				// Classificação para solos argilosos
				else if (
					description.includes('SILTE ARGILOSO.') ||
					description.includes(
						'ARGILA ARENOSA, COR VERMELHA ESCURA.',
					) ||
					description.includes(
						'ARGILA ARENOSA (ARENITO), COR VERMELHA CLARA COM MANCHAS CINZA CLARA.',
					) ||
					description.includes(
						'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA.',
					) ||
					description.includes(
						'ARGILA ARENOSA, COR VERMELHA CLARA COM MANCHAS MARROM CLARA E CINZA ESCURA.',
					) ||
					description.includes(
						'ARGILA ARENOSA, COR VERMELHA CLARA.',
					) ||
					description.includes(
						'ARGILA SILTOSA, COR VERMELHA CLARA.',
					) ||
					description.includes(
						'ARGILA SILTOSA, COR VERMELHA CLARA COM MANCHAS CINZA .',
					) ||
					description.includes(
						'ARGILA SILTOSA, COR VERMELHA ESCURA COM MANCHAS CINZA ESCURA.',
					) ||
					description.includes(
						'ARGILA SILTOSA, COR VERMELHA ESCURA.',
					) ||
					description.includes(
						'ARGILA SILTOSA COM SEIXOS, COR VERMELHA CLARA.',
					) ||
					description.includes('ARGILA ARGILOSA.')
				) {
					// Regras para solos argilosos baseadas na soma dos hits
					if (hitSum <= 2) {
						soilText = 'Muito mole';
					} else if (hitSum >= 3 && hitSum <= 5) {
						soilText = 'Mole';
					} else if (hitSum >= 6 && hitSum <= 10) {
						soilText = 'Média(o)';
					} else if (hitSum >= 11 && hitSum <= 19) {
						soilText = 'Rija(o)';
					} else if (hitSum > 19) {
						soilText = 'Dura(o)';
					}
				}

				const yPosition = startY + (meter + 0.5) * rulerSpacing; // Calcula a posição Y para o texto
				// Lógica de printSpt
				if (meter === 0 && data.printSpt === 'N') {
					// Se o printSpt for 'N', desenhe um retângulo branco sobre a primeira linha
					pdf.setFillColor(255, 255, 255); // Cor branca

					// Cobrir a área do perfil geológico
					pdf.rect(
						rulerStartX + 50, // Posição X do retângulo (ajuste conforme necessário)
						yPosition - 5, // Posição Y do retângulo (ajuste conforme necessário)
						50, // Largura do retângulo (ajuste conforme necessário)
						10, // Altura do retângulo (ajuste conforme necessário)
						'F', // O 'F' indica preenchimento
					);

					// Cobrir a área da classificação da camada
					pdf.rect(
						rulerStartX + 130, // Posição X do retângulo (ajuste conforme necessário)
						yPosition - 5, // Posição Y do retângulo (ajuste conforme necessário)
						20, // Largura do retângulo (ajuste conforme necessário)
						10, // Altura do retângulo (ajuste conforme necessário)
						'F', // O 'F' indica preenchimento
					);

					// Cobrir a área dos golpes
					pdf.rect(
						rulerStartX + 190, // Posição X para a coluna de golpes
						yPosition - 5, // Posição Y (ajuste conforme necessário)
						30, // Largura do retângulo que cobre os golpes
						10, // Altura do retângulo (ajuste conforme necessário)
						'F', // Preenchimento
					);

					// Continue para não desenhar o texto da primeira linha
					continue;
				}

				// Se o texto do solo atual for diferente do anterior, desenhe-o
				if (soilText !== prevText) {
					// Desenhar um retângulo branco para sobrepor o texto anterior
					pdf.setFillColor(255, 255, 255); // Cor branca
					pdf.rect(
						rulerStartX + 110.301, // Posição X
						yPosition + 3, // Posição Y
						17.5, // Largura
						25, // Altura
						'F', // Preenchimento
					);

					// Defina o tamanho da fonte e desenhe o texto
					pdf.setFontSize(8);
					drawSoilText(soilText, yPosition + 12); // Desenha o texto ajustado na posição Y

					doc.setFillColor(255, 255, 255);
					doc.setDrawColor('#fff');
					pdf.rect(
						rulerStartX + 110.301, // Posição X
						yPosition + 3, // Posição Y
						17.5, // Largura
						50, // Altura
						'F', // Preenchimento
					);

					// Atualiza o texto anterior
					prevText = soilText;
				}

				// Lógica para a próxima profundidade
				if (nextDepth >= layer.depth) {
					currentLayerIndex++;
				}
			}
			console.log(data.printSpt);
		}

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

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		//CHAMADA DAS FUNÇÕES
		const totalMeters = pageHeight; // Defina quantos metros quer renderizar
		drawHorizontalLines(
			doc,
			rulerStartX,
			pageWidth,
			rulerSpacing,
			startY,
			totalMeters,
		);

		drawLineOnDescriptionChange(
			doc,
			data,
			rulerStartX,
			pageWidth,
			rulerSpacing,
		);

		drawLayerDescriptions(
			doc,
			data,
			rulerStartX,
			rulerSpacing,
			pageHeight,
			startY,
			finalDepth,
		);

		checkSoilDescriptionAndDrawText(
			doc,
			data,
			rulerStartX,
			rulerSpacing,
			startY,
			data.printSpt,
		);

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');

		// Definir posição Y inicial para o texto à esquerda
		let yPosition = 5; // Posição Y inicial sem margem

		//////////////////////////////////////////////////////////////////////////
		// Desenhar o texto à esquerda
		// doc.text(`Cliente: ${data.username}`, marginLeft, yPosition);
		doc.text(`Cliente: `, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.setFont('Times New Roman', 'bold');
		doc.text(`${data.username}`, marginLeft + 13, yPosition);
		yPosition += lineSpacing;
		//////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////
		// doc.text(`Obra: ${data.obra}`, marginLeft, yPosition);
		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');
		doc.text(`Obra: `, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.text(`${data.obra} `, marginLeft + 13, yPosition);
		yPosition += lineSpacing;
		//////////////////////////////////////////////////////////////////////////

		//////////////////////////////////////////////////////////////////////////
		doc.setFontSize(8);
		doc.setFont('Times New Roman', 'normal');
		// doc.text(`Local: ${data.local}`, marginLeft, yPosition);
		doc.text(`Local:`, marginLeft, yPosition);
		doc.setFontSize(12);
		doc.text(` ${data.local}`, marginLeft + 12, yPosition);
		yPosition += lineSpacing;
		////////////////////////////////////////////////////////////////////////

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
		doc.text(`COTA ${data.cota}`, separatorX + 2, rightYPosition, {
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

		// Desenhar coluna da régua
		let rulerYPosition = 50; // Começar na posição Y 50 para a régua

		doc.line(marginLeft + 15, 22, marginLeft + 15, 22);
		doc.text('COTA (m)', marginLeft, 35);

		// Adicionar linha horizontal na posição indicada
		const lineYPosition = 50; // Ajuste a posição Y conforme necessário
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

		const step = 10; // Altura de 1 metro em mm (ajuste conforme necessário)

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

			// // Desenha o retângulo verticalmente (uma coluna)
			// doc.rect(marginLeft + 165, currentY, 2.8, step, 'F'); // Retângulo entre as linhas de 10 e 20 mm

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

		// Desenhar régua na coluna da esquerda
		doc.setLineWidth(0.2);
		doc.setFontSize(8);

		// Definir espaçamentos e dimensões

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

			doc.setLineWidth(0.2);
			doc.line(
				rulerStartX - lineLength,
				rulerYPosition,
				rulerStartX,
				rulerYPosition,
			);

			rulerYPosition += rulerSpacing;
		}

		// Desenhar as linhas de profundidade
		data.profundidadeCamada.forEach((depth: number) => {
			// // Limitar a profundidade até 14
			// if (depth > 14) {
			// 	console.log(`Profundidade ${depth} ignorada, pois é maior que 14.`);
			// 	return;
			// }

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

		// Itera sobre as profundidades e desenha no PDF
		// Variáveis para armazenar os últimos e penúltimos hits e profundidades

		// Itera sobre as profundidades e desenha no PDF
		for (
			let index = 0;
			index < data.profundities.length && index <= 16;
			index++
		) {
			const profundity = data.profundities[index];
			const adjustedYPosition = startY + (index + 0.5) * rulerSpacing - 6;
			doc.setFontSize(8);
			console.log(profundity);

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
				y: adjustedYPosition + 15,
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
			listHits.push(profundity);
			console.log(listHits);
		}

		// doc.setFillColor(255, 255, 255);
		// doc.setDrawColor('#fff');
		// doc.rect(marginLeft + 166, 50, 19, 19, 'FD');

		data.layer.forEach((layer: any, index: number) => {
			console.log(`Layer ${index} Image:`, layer.backgroundImage);
			// Desenha quadrado para cada intervalo de metro
			const previousDepth = index === 0 ? 0 : data.layer[index - 1].depth;
			const currentDepth = layer.depth;

			const imgHeight =
				(layer.depth -
					(index === 0 ? 0 : data.layer[index - 1].depth)) *
					rulerSpacing -
				0.8;
			const adjustedHeight = Math.max(imgHeight, 0);
			const imgY =
				startY +
				(index === 0 ? 0 : data.layer[index - 1].depth) * rulerSpacing;
			const imgX = marginLeft + 15.5;
			const squareWidth = 20;
			const imgWidth = squareWidth;

			// Adicionando a imagem ao PDF
			if (layer.backgroundImage.startsWith('data:image/png;base64,')) {
				console.log(`Adicionando imagem da camada ${index} no PDF.`);
				doc.addImage(
					layer.backgroundImage,
					'PNG',
					imgX,
					imgY + 0.5,
					imgWidth - 1,
					adjustedHeight,
				);
			} else {
				console.error(`Layer ${index} não tem uma imagem PNG válida.`);
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
					////////////////////////////////////////////////////////////////
					squareY + 5,
					////////////////////////////////////////////////////////////////
					imgWidth - 16,
					rulerSpacing / 2 - 4,
					'FD',
				); // Quadrado pequeno

				// Coloca a numeração dentro do quadrado
				doc.setFontSize(8);
				doc.text(
					String(meter),
					marginLeft + 23,
					/////////////////////////////////////////////////////////////
					squareY + rulerSpacing / 4 + 4,
					/////////////////////////////////////////////////////////////
				);
			}
		});

		/////////////////////////////////////////////////////////////////////
		doc.setLineWidth(0.8);
		doc.line(marginLeft + 15, 50, marginLeft + 15, 80);
		doc.line(marginLeft + 35, 50, marginLeft + 35, 80);
		doc.setLineWidth(0.1);

		///////////////////////////////////////////////////////////////////

		for (let i = 0; i < markPositions.length - 1; i++) {
			doc.setDrawColor('red');
			const start = markPositions[i];
			const end = markPositions[i + 1];
			doc.line(start.x, start.y, end.x, end.y);
		}

		// Desenhar linha horizontal completa na parte inferior, abaixo dos textos
		const lineY = rightYPosition + lineSpacing - 8; // Posição Y da linha horizontal, abaixo do texto
		doc.setLineWidth(0.1);
		doc.setDrawColor('#000');
		doc.line(marginLeft, lineY, pageWidth - marginRight, lineY); // Linha horizontal da margem esquerda até a margem direita

		//////////////////////////////////////////////////////////////////////
		doc.setFillColor(255, 255, 255);
		doc.rect(marginLeft + 21, 73, 6, 3, 'FD');
		doc.text('2,00', marginLeft + 21.5, 75.5);
		//////////////////////////////////////////////////////////////////

		// doc.addImage(
		// 	data.footer,
		// 	'PNG',
		// 	marginLeft,
		// 	lineY + 237,
		// 	pageWidth - marginRight,
		// 	lineY + 16,
		// );

		doc.addImage(
			data.na,
			'PNG',
			marginLeft + 200,
			pageHeight / 2 - 40,
			8,
			8,
		);
		doc.text(`15,67`, marginLeft + 200, pageHeight / 2 - 43);

		doc.text(
			'Mole',
			rulerStartX + 115, // Posição X
			85,
		);

		doc.text(
			'Média(o)',
			rulerStartX + 113, // Posição X
			150,
		);
		doc.line(rulerStartX + 110, 168, rulerStartX + 128, 168);
		doc.text(
			'Rija(o)',
			rulerStartX + 115, // Posição X
			220,
		);

		doc.setDrawColor('#fff');
		doc.setFillColor(255, 255, 255);
		doc.rect(rulerStartX + 110.2, 122, 17.5, 5, 'FD');
	};

	drawFirstPage(
		doc,
		data,
		startY,
		rulerSpacing,
		pageHeight,
		rulerStartX,
		pageWidth,
	);

	// drawSecondPageContent(
	// 	doc,
	// 	data,
	// 	startY,
	// 	rulerSpacing,
	// 	pageHeight,
	// 	rulerStartX,
	// 	pageWidth,
	// 	finalDepthPageOne,
	// 	finalDescriptionPageOne,
	// );

	// Salve o PDF
	doc.save('grafico.pdf');
};

export default generatePDF;
