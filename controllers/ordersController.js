const express = require('express')
const router = express.Router()


router.get('/catererID/order/new', (req,res)=>{
    res.send('ROTA PARA EXECUTAR O PEDIDO')
})

module.exports = router