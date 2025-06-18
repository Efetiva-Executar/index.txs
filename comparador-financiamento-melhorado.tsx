import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, TrendingUp, Building, Clock, Percent } from 'lucide-react';

const ComparadorFinanciamento = () => {
  const [valorImovel, setValorImovel] = useState('');
  const [valorDesejado, setValorDesejado] = useState('');
  const [idade, setIdade] = useState('');
  const [prazoAnos, setPrazoAnos] = useState('30');
  const [modalidadeEscolhida, setModalidadeEscolhida] = useState('SAC');
  const [imovelNovo, setImovelNovo] = useState(false); // Inicia como usado
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Base de dados técnica atualizada dos bancos
  const obterCondicoesBancos = (valorImovelNum, imovelNovoFlag) => {
    const condicoes = [];

    // CAIXA - Múltiplas modalidades
    // SBPE
    condicoes.push({
      nome: 'Caixa SBPE (TR)',
      banco: 'Caixa',
      categoria: 'SBPE',
      percentualSAC: 70,
      percentualPRICE: 50,
      taxa: 11.49,
      indice: 'TR',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 360, // TR/Poupança PRICE = 360 meses
      valorMinimoFinanciamento: 50000,
      valorMinimoImovel: 0,
      observacoes: ''
    });

    condicoes.push({
      nome: 'Caixa SBPE (Poupança)',
      banco: 'Caixa',
      categoria: 'SBPE',
      percentualSAC: 70,
      percentualPRICE: 50,
      taxa: 10.76,
      indice: 'Poupança',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 360, // TR/Poupança PRICE = 360 meses
      valorMinimoFinanciamento: 50000,
      valorMinimoImovel: 0,
      observacoes: ''
    });

    // Classe Média Usado
    condicoes.push({
      nome: 'Caixa Classe Média (Usado)',
      banco: 'Caixa',
      categoria: 'Classe Média',
      percentualSAC: 60,
      percentualPRICE: 60,
      taxa: 10.5,
      indice: 'TR',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 100000,
      valorMinimoImovel: 0,
      observacoes: '',
      condicaoEspecial: !imovelNovoFlag // Só para imóvel usado
    });

    // Classe Média Novo
    if (imovelNovoFlag) {
      condicoes.push({
        nome: 'Caixa Classe Média (Novo)',
        banco: 'Caixa',
        categoria: 'Classe Média',
        percentualSAC: 80,
        percentualPRICE: 80,
        taxa: 10.5,
        indice: 'TR',
        modalidades: ['SAC', 'PRICE'],
        prazoMaximo: 420,
        valorMinimoFinanciamento: 100000,
        valorMinimoImovel: 0,
        observacoes: ''
      });
    }

    // ITAÚ - Apenas SAC
    condicoes.push({
      nome: 'Itaú Agência',
      banco: 'Itaú',
      categoria: 'Agência',
      percentualSAC: 60,
      percentualPRICE: 0, // Não trabalha com PRICE
      taxa: 13.69,
      indice: 'TR',
      modalidades: ['SAC'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 30000,
      valorMinimoImovel: 0,
      observacoes: 'Conta corrente comum'
    });

    condicoes.push({
      nome: 'Itaú Uniclass',
      banco: 'Itaú',
      categoria: 'Uniclass',
      percentualSAC: 80,
      percentualPRICE: 0, // Não trabalha com PRICE
      taxa: 13.09,
      indice: 'TR',
      modalidades: ['SAC'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 30000,
      valorMinimoImovel: 0,
      observacoes: 'Renda acima R$ 5.000'
    });

    condicoes.push({
      nome: 'Itaú Personnalité',
      banco: 'Itaú',
      categoria: 'Personnalité',
      percentualSAC: 80,
      percentualPRICE: 0, // Não trabalha com PRICE
      taxa: 12.39,
      indice: 'TR',
      modalidades: ['SAC'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 30000,
      valorMinimoImovel: 0,
      observacoes: 'Renda acima R$ 20.000'
    });

    // BRADESCO
    condicoes.push({
      nome: 'Bradesco',
      banco: 'Bradesco',
      categoria: 'Padrão',
      percentualSAC: 70,
      percentualPRICE: 70,
      taxa: 13.50,
      indice: 'TR',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 25000, // Equivalente a prestação mínima de R$ 200
      valorMinimoImovel: 0,
      observacoes: '',
      prestacaoMinima: 200
    });

    // SANTANDER
    condicoes.push({
      nome: 'Santander',
      banco: 'Santander',
      categoria: 'Padrão',
      percentualSAC: 80,
      percentualPRICE: 80,
      taxa: 13.79,
      indice: 'TR',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 90000,
      valorMinimoImovel: 0,
      observacoes: ''
    });

    // BANCO DO BRASIL
    condicoes.push({
      nome: 'Banco do Brasil',
      banco: 'Banco do Brasil',
      categoria: 'Padrão',
      percentualSAC: 70,
      percentualPRICE: 70,
      taxa: 17.00,
      indice: 'TR',
      modalidades: ['SAC', 'PRICE'],
      prazoMaximo: 360,
      valorMinimoFinanciamento: 50000,
      valorMinimoImovel: 0,
      observacoes: 'Apenas correntistas'
    });

    // BANCO INTER - Apenas SAC
    condicoes.push({
      nome: 'Banco Inter',
      banco: 'Banco Inter',
      categoria: 'IPCA',
      percentualSAC: 75,
      percentualPRICE: 0, // Não trabalha com PRICE
      taxa: 9.5, // Taxa base + IPCA
      indice: 'IPCA',
      modalidades: ['SAC'],
      prazoMaximo: 420,
      valorMinimoFinanciamento: 100000,
      valorMinimoImovel: 200000,
      observacoes: 'CET 10,89%'
    });

    return condicoes.filter(c => c.condicaoEspecial !== false);
  };

  const calcularParcela = (valor, taxa, prazoMeses, modalidade) => {
    const i = taxa / 12 / 100;
    
    if (modalidade === 'PRICE') {
      return valor * (i / (1 - Math.pow(1 + i, -prazoMeses)));
    } else {
      // SAC - Primeira parcela (maior)
      const amortizacao = valor / prazoMeses;
      return amortizacao + (valor * i);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const processar = () => {
    const vImovel = parseFloat(valorImovel.replace(/\D/g, ''));
    const vDesejado = parseFloat(valorDesejado.replace(/\D/g, ''));
    const idadeNum = parseInt(idade);
    const prazoAnosNum = parseInt(prazoAnos);

    if (!vImovel || !vDesejado || !idadeNum || !prazoAnosNum) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const percentualSolicitado = (vDesejado / vImovel) * 100;
    // Idade máxima corrigida: 80 anos e 6 meses = 966 meses
    const prazoMaximoIdade = 966 - (idadeNum * 12);
    const prazoEscolhido = prazoAnosNum * 12;

    const condicoesBancos = obterCondicoesBancos(vImovel, imovelNovo);
    const resultadosProcessados = [];

    // Processar apenas para a modalidade escolhida
    condicoesBancos.forEach(condicao => {
      if (!condicao.modalidades.includes(modalidadeEscolhida)) return;

      const percentualPermitido = modalidadeEscolhida === 'SAC' ? condicao.percentualSAC : condicao.percentualPRICE;
      if (percentualPermitido === 0) return;

      const valorMaximoFinanciamento = (vImovel * percentualPermitido) / 100;
      const prazoFinal = Math.min(prazoMaximoIdade, prazoEscolhido, condicao.prazoMaximo);

      let viavel = true;
      let observacao = '';

      // Verificar restrições
      if (vDesejado > valorMaximoFinanciamento) {
        viavel = false;
        observacao = `Valor excede limite de ${percentualPermitido}% (máx: ${formatarMoeda(valorMaximoFinanciamento)})`;
      } else if (vDesejado < condicao.valorMinimoFinanciamento) {
        viavel = false;
        observacao = `Valor abaixo do mínimo exigido (mín: ${formatarMoeda(condicao.valorMinimoFinanciamento)})`;
      } else if (vImovel < condicao.valorMinimoImovel) {
        viavel = false;
        observacao = `Valor do imóvel abaixo do mínimo (mín: ${formatarMoeda(condicao.valorMinimoImovel)})`;
      } else if (prazoFinal < 12) {
        viavel = false;
        observacao = `Prazo insuficiente pela idade (máx: ${Math.floor(prazoFinal/12)} anos)`;
      } else if (condicao.prestacaoMinima) {
        // Verificar se a parcela seria menor que o mínimo
        const parcelaCalculada = calcularParcela(vDesejado, condicao.taxa, prazoFinal, modalidadeEscolhida);
        if (parcelaCalculada < condicao.prestacaoMinima) {
          viavel = false;
          observacao = `Parcela abaixo do mínimo de ${formatarMoeda(condicao.prestacaoMinima)}`;
        }
      }

      let parcela = 0;
      if (viavel) {
        parcela = calcularParcela(vDesejado, condicao.taxa, prazoFinal, modalidadeEscolhida);
        observacao = `${Math.floor(prazoFinal/12)} anos`;
        if (condicao.observacoes) {
          observacao += ` - ${condicao.observacoes}`;
        }
      }

      resultadosProcessados.push({
        banco: condicao.nome,
        categoria: condicao.categoria,
        percentualPermitido,
        valorMaximo: valorMaximoFinanciamento,
        viavel,
        parcela,
        taxa: condicao.taxa,
        indice: condicao.indice,
        modalidade: modalidadeEscolhida,
        prazoMeses: prazoFinal,
        observacao,
        observacoesBanco: condicao.observacoes,
        valorMinimoFinanciamento: condicao.valorMinimoFinanciamento,
        valorMinimoImovel: condicao.valorMinimoImovel
      });
    });

    // Ordenar por viabilidade e depois por menor parcela
    resultadosProcessados.sort((a, b) => {
      if (a.viavel && !b.viavel) return -1;
      if (!a.viavel && b.viavel) return 1;
      if (a.viavel && b.viavel) return a.parcela - b.parcela;
      return 0;
    });

    setResultados(resultadosProcessados);
    setMostrarResultados(true);
  };

  const formatarInput = (valor, setter) => {
    const numero = valor.replace(/\D/g, '');
    const formatado = new Intl.NumberFormat('pt-BR').format(numero);
    setter(formatado);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Comparador Técnico de Financiamento Imobiliário</h1>
          </div>
          <p className="text-gray-600">Sistema de comparação automática das melhores condições de financiamento entre instituições financeiras</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Dados do Financiamento
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Imóvel *
              </label>
              <input
                type="text"
                value={valorImovel}
                onChange={(e) => formatarInput(e.target.value, setValorImovel)}
                placeholder="R$ 300.000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Desejado para Financiamento *
              </label>
              <input
                type="text"
                value={valorDesejado}
                onChange={(e) => formatarInput(e.target.value, setValorDesejado)}
                placeholder="R$ 240.000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade do Cliente *
              </label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="35"
                min="18"
                max="79"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo Desejado (anos)
              </label>
              <select
                value={prazoAnos}
                onChange={(e) => setPrazoAnos(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="15">15 anos</option>
                <option value="20">20 anos</option>
                <option value="25">25 anos</option>
                <option value="30">30 anos</option>
                <option value="35">35 anos</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modalidade de Amortização
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={modalidadeEscolhida === 'SAC'}
                    onChange={() => setModalidadeEscolhida('SAC')}
                    className="mr-2"
                  />
                  <span>SAC (Parcelas Decrescentes)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={modalidadeEscolhida === 'PRICE'}
                    onChange={() => setModalidadeEscolhida('PRICE')}
                    className="mr-2"
                  />
                  <span>PRICE (Parcelas Fixas)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo do Imóvel
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!imovelNovo}
                    onChange={() => setImovelNovo(false)}
                    className="mr-2"
                  />
                  <span>Imóvel Usado</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={imovelNovo}
                    onChange={() => setImovelNovo(true)}
                    className="mr-2"
                  />
                  <span>Imóvel Novo</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={processar}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Comparar Condições ({modalidadeEscolhida})
          </button>
        </div>

        {/* Resultados */}
        {mostrarResultados && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-green-600" />
              Comparativo de Condições - {modalidadeEscolhida}
            </h2>

            {/* Resumo */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Resumo da Solicitação</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Valor do Imóvel:</span>
                  <div className="font-semibold">{formatarMoeda(parseFloat(valorImovel.replace(/\D/g, '')))}</div>
                </div>
                <div>
                  <span className="text-gray-600">Financiamento:</span>
                  <div className="font-semibold">{formatarMoeda(parseFloat(valorDesejado.replace(/\D/g, '')))}</div>
                </div>
                <div>
                  <span className="text-gray-600">Percentual:</span>
                  <div className="font-semibold">{((parseFloat(valorDesejado.replace(/\D/g, '')) / parseFloat(valorImovel.replace(/\D/g, ''))) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <div className="font-semibold">{imovelNovo ? 'Novo' : 'Usado'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Prazo Máximo:</span>
                  <div className="font-semibold">{Math.min(Math.floor((966 - parseInt(idade) * 12) / 12), parseInt(prazoAnos))} anos</div>
                </div>
              </div>
            </div>

            {/* Tabela de Resultados */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left font-semibold">Instituição</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">Status</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">Taxa/Índice</th>
                    <th className="border border-gray-200 p-3 text-center font-semibold">Parcela Est.</th>
                    <th className="border border-gray-200 p-3 text-left font-semibold">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((resultado, index) => (
                    <tr key={index} className={resultado.viavel ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}>
                      <td className="border border-gray-200 p-3">
                        <div>
                          <div className="font-semibold">{resultado.banco}</div>
                          <div className="text-xs text-blue-600 font-medium">{resultado.modalidade}</div>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        {resultado.viavel ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">VIÁVEL</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">INVIÁVEL</span>
                        )}
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        <div className="font-semibold">a partir de {resultado.taxa}%</div>
                        <div className="text-xs text-gray-600">{resultado.indice}</div>
                      </td>
                      <td className="border border-gray-200 p-3 text-center">
                        {resultado.viavel ? (
                          <div className="font-bold text-base">{formatarMoeda(resultado.parcela)}</div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border border-gray-200 p-3 text-xs">
                        {resultado.observacao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Estatísticas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-800 font-semibold">Opções Viáveis</div>
                <div className="text-2xl font-bold text-green-600">
                  {resultados.filter(r => r.viavel).length}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-800 font-semibold">Melhor Taxa</div>
                <div className="text-xl font-bold text-blue-600">
                  {resultados.filter(r => r.viavel).length > 0 
                    ? `${Math.min(...resultados.filter(r => r.viavel).map(r => r.taxa))}%`
                    : 'N/A'
                  }
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-800 font-semibold">Menor Parcela</div>
                <div className="text-lg font-bold text-purple-600">
                  {resultados.filter(r => r.viavel).length > 0 
                    ? formatarMoeda(Math.min(...resultados.filter(r => r.viavel).map(r => r.parcela)))
                    : 'N/A'
                  }
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-800 font-semibold">Modalidade</div>
                <div className="text-xl font-bold text-orange-600">
                  {modalidadeEscolhida}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aviso Legal */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-semibold">Aviso Legal Importante</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Esta simulação é uma estimativa técnica baseada em condições públicas conhecidas. 
                NÃO representa proposta oficial nem garantia de aprovação de crédito. As taxas podem variar conforme análise de crédito, 
                relacionamento bancário e condições de mercado. Valores de seguros, IOF e taxas administrativas não estão inclusos. 
                Para condições reais e propostas oficiais, procure diretamente as instituições financeiras ou correspondentes autorizados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparadorFinanciamento;