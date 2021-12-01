const express = require('express')
const router = express.Router()

router.get('/caterers', (req, res) => {
  res.send('ROTA DE FORNECEDORES')
})

router.get('/caterers/ID/menu', (req, res) => {
  res.send('ROTA DE CARDÁPIOS')
})

router.get('/caterers/ID/menu/new', (req, res) => {
  res.send('ROTA PARA ADICIONAR CARDÁPIO')
})

router.get('/caterer/orderID', (req,res)=>{
  res.send('ROTA PARA EXIBIR OS PEDIDOS DO FORNECEDOR?')
})

module.exports = router
