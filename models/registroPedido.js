const date = require("joi/lib/types/date");

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const RegistroPedidoSchema = Schema({
    pedido: { type: Schema.Types.ObjectId, ref: 'Pedido', required: true},
    tipo: { type: String, required: true },
    situacao: { type: String, required: true },
    data: { type: Date, default: date.now },
    data: { type: Object },
}, { timestamps: true});

module.exports = mongoose.model("RegistroPedido", RegistroPedidoSchema);