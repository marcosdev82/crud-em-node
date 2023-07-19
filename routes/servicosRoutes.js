const express = require('express')
const router = express.Router()
const ServicosController = require('../controllers/ServicosController')
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, ServicosController.createServico)
router.post('/add', checkAuth, ServicosController.createServicoSave)
router.get('/edit/:id', checkAuth, ServicosController.updateServico)
router.post('/edit', checkAuth, ServicosController.updateServicoSave)
router.get('/dashboard', checkAuth, ServicosController.dashboard)
router.post('/remove', checkAuth, ServicosController.removeServico)
router.get('/', ServicosController.showServicos)

module.exports = router