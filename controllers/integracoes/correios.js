const Correios = require("node-correios"),
        correios = new Correios(),
        config = require("../../config/correios"),
        { calcBox } = require("../../helpers/calcBox");

const calcularFrete = async ({cep, produtos}) => {
    
    const _produtos = produtos.map(item => ({
        pesoKg: item.variacao.entrega.pesoKg,
        profundidadeCm: item.variacao.entrega.dimensoes.profundidadeCm,
        alturaCm: item.variacao.entrega.dimensoes.alturaCm,
        larguraCm: item.variacao.entrega.dimensoes.larguraCm,
        quantidade: item.quantidade,
        preco: item.precoUnitario
    }));

    const caixa = calcBox(_produtos);
    const pesoTotal = _produtos.reduce((all, item) => all + (item.pesoKg * item.quantidade) , 0);
    const valorFinal = _produtos.reduce((all, item) => all + (item.preco * item.quantidade) , 0);

    try {
        const resultados = await Promise.all(
            config.nCdServico.split(',').map(async(servico) => {
                const resultado = await correios.calcPrecoPrazo({
                    // nCdEmpresa: config.nCdEmpresa, // Só pra quem tem contrato
                    // sDsSenha: config.sDsSenha, // Só pra quem tem contrato
                    nCdServico: servico,
                    sCepOrigem: config.sCepOrigem,
                    sCepDestino: cep,
                    nVlPeso: pesoTotal,
                    nCdFormato: 1,
                    nVlComprimento: caixa.comprimento,
                    nVlAltura: caixa.altura,
                    nVlLargura: caixa.largura,
                    nVlDiametro: 0,
                    nVlValorDeclarado: valorFinal < 23.5 ? 23.5 : valorFinal
                });

                return { ...resultado[0] };
            })
        )
        return resultados;
    } catch (e) {
        console.log(e);
        next(e);
    }
}

module.exports = { calcularFrete };