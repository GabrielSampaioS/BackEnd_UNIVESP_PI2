const Event = require('../models/eventModel');
const { v4: uuidv4 } = require('uuid');

// Cadastrar cliente
async function criarCliente(req, res) {
  try {
    const { nome, sobrenome, telefone, cpf, email } = req.body;
    const aggregate_id = uuidv4();

    const evento = new Event({
      aggregate_id,
      event_type: 'ClienteCadastrado',
      event_data: { nome, sobrenome, telefone, cpf, email }
    });

    await evento.save();
    res.json({ message: 'Cliente cadastrado com sucesso!', aggregate_id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
}

// Localizar clientes por nome
async function localizarClientes(req, res) {
  try {
    const { nome } = req.query;
    if (!nome) return res.json([]);

    const clientes = await Event.find({
      event_type: 'ClienteCadastrado',
      'event_data.nome': { $regex: nome, $options: 'i' }
    });

    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao localizar clientes' });
  }
}

// Obter histórico completo
async function obterHistorico(req, res) {
  try {
    const { aggregate_id } = req.query;
    console.log(aggregate_id)
    if (!aggregate_id) return res.status(400).json({ error: 'aggregate_id obrigatório' });

    const eventos = await Event.find({ aggregate_id }).sort({ created_at: 1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter histórico do cliente' });
  }
}

// Registrar dívida //Criar o controleer e model separado ?
async function registrarDivida(req, res) {
  try {
    const { aggregate_id, valor } = req.body;
    const evento = new Event({
      aggregate_id,
      event_type: 'DividaRegistrada',
      event_data: { valor }
    });
    await evento.save();
    res.json({ message: 'Dívida registrada!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar dívida' });
  }
}

// Registrar pagamento
async function registrarPagamento(req, res) {
  try {
    const { aggregate_id, valor } = req.body;
    const evento = new Event({
      aggregate_id,
      event_type: 'PagamentoEfetuado',
      event_data: { valor }
    });
    await evento.save();
    res.json({ message: 'Pagamento registrado!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar pagamento' });
  }
}

module.exports = {
  criarCliente,
  localizarClientes,
  obterHistorico,
  registrarDivida,
  registrarPagamento
};
