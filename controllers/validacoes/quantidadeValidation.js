const mongoose = require("mongoose");

const Variacao = mongoose.model("Variacao");

const validarQuantidadeDisponivel = async (_carrinho) => {
    let todosTemQuantidadeDisponivel = true;

    try {
        const carrinho = await Promise.all(_carrinho.map(async item => {
            item.variacao = await Variacao.findById(item.variacao._id || item.variacao);
            return item;
        }));

        carrinho.forEach(item => {
            if(!item.variacao.quantidade || item.variacao.quantidade < item.quantidade){
                todosTemQuantidadeDisponivel = false;
            }
        });

        return todosTemQuantidadeDisponivel;
        
    } catch (error) {
        console.warn(error);
        return false;
    }
};

const atualizarQuantidade = async(tipo, pedido) => {
    try {
        const carrinho = await Promise.all(pedido.carrinho.map(async item => {
            item.variacao = await Variacao.findById(item.variacao._id || item.variacao);

            if( tipo === "salvar_pedido"){
                item.variacao.quantidade -= item.quantidade;
                item.variacao.quantidadeBloqueada += item.quantidade;
            }else if(tipo === "confirmar_pedido"){
                if(item.variacao.quantidadeBloqueada < item.quantidade){
                    item.variacao.quantidadeBloqueada = 0;
                }else{
                    item.variacao.quantidadeBloqueada -= item.quantidade;
                }
            }else if(tipo === "cancelar_pedido"){
                if(item.variacao.quantidadeBloqueada < item.quantidade){
                    item.variacao.quantidadeBloqueada = 0;
                }else{
                    item.variacao.quantidadeBloqueada -= item.quantidade;
                }
                item.variacao.quantidade += item.quantidade;
            }

            await item.variacao.save();
            return item;
        }));
        return true;
    } catch (error) {
        console.warn(error);
        return error;
    }
};

module.exports = {
    validarQuantidadeDisponivel,
    atualizarQuantidade
};