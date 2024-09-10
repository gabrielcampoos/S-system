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

	// Função para desenhar as linhas horizontais marcando os metros
	function drawHorizontalLines(
		pdf: any,
		data: any,
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
			pdf.line(rulerStartX + 110, yPosition, pageWidth - 66, yPosition);
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
	) {
		// Ordena as camadas por profundidade para garantir que o cálculo esteja correto
		const layers = data.layer.sort((a: any, b: any) => a.depth - b.depth);

		layers.forEach((layer: any, index: number) => {
			const { depth, description } = layer;

			// Define profundidades anteriores e atuais
			const prevDepth = index === 0 ? 0 : layers[index - 1].depth;
			const currentDepth = depth;

			// Calcula a posição Y média entre a profundidade anterior e a atual
			const yPosition =
				startY + ((prevDepth + currentDepth) / 2) * rulerSpacing;

			if (yPosition >= 0 && yPosition <= pageHeight) {
				// Calcula a altura do texto para centralizar verticalmente
				const textHeightApprox = 2; // Ajuste conforme necessário
				const yCenteredPosition = yPosition + textHeightApprox / 2;

				// Desenhar o texto da classificação
				pdf.text(description, rulerStartX + 52, yCenteredPosition); // Ajuste a posição X se necessário
			} else {
				console.warn(`Profundidade ${depth} fora do intervalo visível`);
			}
		});
	}

	// function checkSoilDescriptionAndDrawText(
	// 	pdf: any,
	// 	data: any,
	// 	rulerStartX: number,
	// 	rulerSpacing: number,
	// 	startY: number,
	// 	printSpt: string,
	// ) {
	// 	function drawSoilText(text: string, yPosition: number) {
	// 		const maxLineLength = 10; // Número máximo de caracteres por linha
	// 		const lineHeight = 3; // Espaçamento entre linhas

	// 		const textLines = text.match(
	// 			new RegExp('.{1,' + maxLineLength + '}', 'g'),
	// 		);

	// 		if (textLines) {
	// 			textLines.forEach((line: string, index: number) => {
	// 				pdf.text(
	// 					line,
	// 					rulerStartX + 111,
	// 					yPosition + index * lineHeight,
	// 				);
	// 			});
	// 		}
	// 	}

	// 	const maxDepth = Math.max(...data.layer.map((p: any) => p.depth));
	// 	let currentLayerIndex = 0;
	// 	///////////////////////////////////////////////////////////////////////////
	// 	let prevText = '';
	// 	////////////////////////////////////////////////////////////////////////////
	// 	for (let meter = 0; meter <= maxDepth; meter++) {
	// 		const currentDepth = meter;
	// 		const nextDepth = meter + 1;

	// 		let layer = data.layer[currentLayerIndex];

	// 		while (layer && currentDepth >= layer.depth) {
	// 			currentLayerIndex++;
	// 			layer = data.layer[currentLayerIndex];
	// 		}

	// 		if (!layer) {
	// 			break;
	// 		}

	// 		const { description, hit2, hit3 } = layer;
	// 		const hitSum = (hit2 ?? 0) + (hit3 ?? 0);
	// 		let soilText = '';

	// 		// Classificação para TODAS as descrições, baseada no hitSum
	// 		if (
	// 			description.includes('AREIA FINA ARENOSA') ||
	// 			description.includes('AREIA FINA SILTOSA') ||
	// 			description.includes('AREIA FINA ARGILOSA') ||
	// 			description.includes('SILTE ARENOSO') ||
	// 			description.includes('SILTE SILTOSO')
	// 		) {
	// 			// Regras para solos arenosos e siltosos
	// 			if (hitSum <= 4) {
	// 				soilText = 'Fofa(o)';
	// 			} else if (hitSum >= 5 && hitSum <= 8) {
	// 				soilText = 'Pouco compacta(o)';
	// 			} else if (hitSum >= 9 && hitSum <= 18) {
	// 				soilText = 'Medianamente compacta(o)';
	// 			} else if (hitSum >= 19 && hitSum <= 40) {
	// 				soilText = 'Compacta(o)';
	// 			} else if (hitSum > 40) {
	// 				soilText = 'Muito compacta(o)';
	// 			}
	// 		} else if (
	// 			description.includes('SILTE ARGILOSO') ||
	// 			description.includes('ARGILA ARENOSA') ||
	// 			description.includes('ARGILA SILTOSA') ||
	// 			description.includes('ARGILA ARGILOSA')
	// 		) {
	// 			// Regras para solos argilosos
	// 			if (hitSum <= 2) {
	// 				soilText = 'Muito mole';
	// 			} else if (hitSum >= 3 && hitSum <= 5) {
	// 				soilText = 'Mole';
	// 			} else if (hitSum >= 6 && hitSum <= 10) {
	// 				soilText = 'Média(o)';
	// 			} else if (hitSum >= 11 && hitSum <= 19) {
	// 				soilText = 'Rija(o)';
	// 			} else if (hitSum > 19) {
	// 				soilText = 'Dura(o)';
	// 			}
	// 		}

	// 		const yPosition = startY + (meter + 0.5) * rulerSpacing;

	// 		// Lógica de printSpt
	// 		if (meter === 0 && printSpt === 'N') {
	// 			// Se o printSpt for 'N', pular o desenho da primeira linha
	// 			continue;
	// 		}

	// 		///////////////////////////////////////////////////////////////
	// 		if (soilText !== prevText) {
	// 			pdf.setFillColor(255, 255, 255); // Cor branca
	// 			pdf.rect(
	// 				rulerStartX + 110.301, // X inicial
	// 				yPosition + 3, // Y inicial (ajustado conforme necessário)
	// 				17.5, // Largura do retângulo
	// 				25, // Altura do retângulo (ajustado conforme necessário)
	// 				'F',
	// 			);
	// 			/////////////////////////////////////////////////////////////////////////////
	// 			pdf.setFontSize(8);
	// 			drawSoilText(soilText, yPosition + 12);
	// 			prevText = soilText;
	// 		}

	// 		if (nextDepth > layer.depth) {
	// 			let previousYPosition = 0;

	// 			const remainingDepth = nextDepth - layer.depth;
	// 			const nextLayer = data.layer[currentLayerIndex + 1];
	// 			let nextDescriptionText = '';

	// 			if (nextLayer) {
	// 				const nextHitSum = (hit2 ?? 0) + (hit3 ?? 0);
	// 				const nextDescription = nextLayer.description;

	// 				const currentYPosition =
	// 					startY + layer.depth * rulerSpacing;
	// 				if (
	// 					nextDescription.includes('AREIA FINA ARENOSA') ||
	// 					nextDescription.includes('AREIA FINA SILTOSA') ||
	// 					nextDescription.includes('AREIA FINA ARGILOSA') ||
	// 					nextDescription.includes('SILTE ARENOSO') ||
	// 					nextDescription.includes('SILTE SILTOSO')
	// 				) {
	// 					if (nextHitSum <= 4) {
	// 						nextDescriptionText = 'Fofa(o)';
	// 					} else if (nextHitSum >= 5 && nextHitSum <= 8) {
	// 						nextDescriptionText = 'Pouco compacta(o)';
	// 					} else if (nextHitSum >= 9 && nextHitSum <= 18) {
	// 						nextDescriptionText = 'Medianamente compacta(o)';
	// 					} else if (nextHitSum >= 19 && nextHitSum <= 40) {
	// 						nextDescriptionText = 'Compacta(o)';
	// 					} else if (nextHitSum > 40) {
	// 						nextDescriptionText = 'Muito compacta(o)';
	// 					}
	// 				} else if (
	// 					nextDescription.includes('SILTE ARGILOSO') ||
	// 					nextDescription.includes('ARGILA ARENOSA') ||
	// 					nextDescription.includes('ARGILA SILTOSA') ||
	// 					nextDescription.includes('ARGILA ARGILOSA')
	// 				) {
	// 					if (nextHitSum <= 2) {
	// 						nextDescriptionText = 'Muito mole';
	// 					} else if (nextHitSum >= 3 && nextHitSum <= 5) {
	// 						nextDescriptionText = 'Mole';
	// 					} else if (nextHitSum >= 6 && nextHitSum <= 10) {
	// 						nextDescriptionText = 'Média(o)';
	// 					} else if (nextHitSum >= 11 && nextHitSum <= 19) {
	// 						nextDescriptionText = 'Rija(o)';
	// 					} else if (nextHitSum > 19) {
	// 						nextDescriptionText = 'Dura(o)';
	// 					}
	// 				}
	// 				previousYPosition = currentYPosition;
	// 			}
	// 			const adjustedYPosition =
	// 				previousYPosition + remainingDepth + 2.5;
	// 			if (nextDescriptionText !== prevText) {
	// 				////////////////////////////////////////////////

	// 				doc.setLineWidth(0.1);
	// 				pdf.setFillColor(255, 255, 255); // Cor branca
	// 				pdf.rect(
	// 					rulerStartX + 110.301, // X inicial
	// 					yPosition + 30, // Y inicial (ajustado conforme necessário)
	// 					17.5, // Largura do retângulo
	// 					100, // Altura do retângulo (ajustado conforme necessário)
	// 					'F',
	// 				);

	// 				//////////////////////////////////////
	// 				drawSoilText(nextDescriptionText, adjustedYPosition);

	// 				///////////////////////////////////
	// 				prevText = nextDescriptionText;
	// 				doc.line(rulerStartX + 128, 151, rulerStartX - 2, 151);
	// 				////////////////////////////////////
	// 			}
	// 		}

	// 		if (nextDepth >= layer.depth) {
	// 			currentLayerIndex++;
	// 		}
	// 	}
	// }

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

		const maxDepth = Math.max(...data.layer.map((p: any) => p.depth)); // Maior profundidade
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
				description.includes('SILTE ARGILOSO') ||
				description.includes('ARGILA ARENOSA') ||
				description.includes('ARGILA SILTOSA') ||
				description.includes('ARGILA ARGILOSA')
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

	const dataInicio = new Date(data.dataInicio).toLocaleDateString('pt-BR');
	const dataFinal = new Date(data.dataFinal).toLocaleDateString('pt-BR');

	const dateText = `Data de início: ${dataInicio}  Término: ${dataFinal}`;
	doc.text(dateText, separatorX + 2, rightYPosition, { align: 'left' });
	rightYPosition += lineSpacing;

	// Desenhar linha vertical da base dos textos até a parte inferior da página
	doc.setLineWidth(0.2);

	doc.line(separatorX, rightYPosition - lineSpacing, separatorX, pageHeight); // Linha vertical da base dos textos até o fundo da página

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
	data.profundidadeCamada.forEach((depth) => {
		// Calcular a posição Y para a profundidade
		const depthYPosition = startY + depth * rulerSpacing;

		// Ajustar a profundidade se estiver fora do intervalo visível
		if (depthYPosition < startY) {
			console.log(
				`Profundidade ${depth} abaixo da posição inicial da régua`,
			);
		} else if (depthYPosition > pageHeight) {
			console.log(`Profundidade ${depth} acima do limite da página`);
		} else {
			doc.setLineWidth(0.2);
			doc.line(
				rulerStartX,
				depthYPosition,
				pageWidth - 84,
				depthYPosition,
			);

			doc.setFontSize(10);
			doc.text(depth.toString(), rulerStartX + 28, depthYPosition - 0.5);

			lineOffImages = depthYPosition;

			console.log(
				`Linha de profundidade ${depth} traçada na posição Y: ${depthYPosition}`,
			);
		}
	});

	// Desenhar classificações

	// // Chamada da função ao gerar o PDF
	const totalMeters = pageHeight; // Defina quantos metros quer renderizar
	drawHorizontalLines(
		doc,
		data,
		rulerStartX,
		pageWidth,
		rulerSpacing,
		startY,
		totalMeters,
	);

	// Desenhar descrições
	drawLayerDescriptions(
		doc,
		data,
		rulerStartX,
		rulerSpacing,
		pageHeight,
		startY,
	);

	// Chamada da função ao gerar o PDF
	drawLineOnDescriptionChange(
		doc,
		data,
		rulerStartX,
		pageWidth,
		rulerSpacing,
	);

	// Desenhar texto das classificações
	checkSoilDescriptionAndDrawText(
		doc,
		data,
		rulerStartX,
		rulerSpacing,
		startY,
		data.printSpt,
	);

	// Itera sobre as profundidades e desenha no PDF
	data.profundities.forEach((profundity, index) => {
		doc.setFontSize(8);
		// Calcula a posição Y para o meio de cada intervalo de profundidade (0.5, 1.5, 2.5, etc.)
		const adjustedYPosition = startY + (index + 0.5) * rulerSpacing;

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

		//Defina as variáveis da marcação
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
			y: adjustedYPosition + 1,
		});

		const resultProfundity =
			profundity.profundity2! + profundity.profundity3!;

		// Desenhar a marcação
		doc.setFont('Times New Roman', 'normal');
		doc.setFontSize(10);
		doc.text(result.toString(), markPosition + 20, adjustedYPosition + 1); // Ajuste a posição Y conforme necessário
		if (resultProfundity !== 30) {
			doc.text(
				`/${resultProfundity}`,
				markPosition + 22,
				adjustedYPosition + 1,
			); // Ajuste a posição Y conforme necessário
		}
	});

	data.layer.forEach((layer, index) => {
		console.log(`Layer ${index} Image:`, layer.backgroundImage);
		// Desenha quadrado para cada intervalo de metro
		const previousDepth = index === 0 ? 0 : data.layer[index - 1].depth;
		const currentDepth = layer.depth;

		const imgHeight =
			(layer.depth - (index === 0 ? 0 : data.layer[index - 1].depth)) *
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

	doc.addImage(
		data.footer,
		'PNG',
		marginLeft,
		lineY + 223,
		pageWidth - marginRight,
		lineY + 30,
	);

	doc.addImage(data.na, 'PNG', marginLeft + 200, pageHeight / 2 - 40, 8, 8);
	doc.text(`${data.waterLevelTwo},00`, marginLeft + 200, pageHeight / 2 - 43);

	// Salve o PDF
	doc.save('grafico.pdf');
};

export default generatePDF;
