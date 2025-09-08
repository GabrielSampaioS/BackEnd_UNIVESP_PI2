const express = require('express');
const router = express.Router();
const {
  criarCliente,
  localizarClientes,
  obterHistorico,
  registrarDivida,
  registrarPagamento
} = require('../controllers/clienteController');

//Cadastrar e localixar user
router.post('/', criarCliente);
router.get('/localizar', localizarClientes);

//trazer historico
router.get('/historico', obterHistorico);

//Atulizar valores
router.post('/divida', registrarDivida);
router.post('/pagamento', registrarPagamento);

module.exports = router;
