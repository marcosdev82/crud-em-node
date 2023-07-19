const Servicos = require('../models/Servicos')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ServicosController {
    static async showServicos(req, res) {

        let search = '';

        if (req.query.search) {
            search = req.query.search
        }

        let page = 0;
        // if (req.params) {

        //     page = parseInt(req.params.skip) * 3
        // }

        console.log(req.params)

        const servicosData = await Servicos.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            limit: 3,
            offset: page
        })

        const servicos = servicosData.map((result) => result.get({plain: true}))

        let servicosQty = servicos.length

        if (servicosQty === 0) {
            servicosQty = false
        }

        res.render('servicos/home', { servicos, search, servicosQty })

    }

    static async dashboard(req, res) {

        const userid = req.session.userid

        const user  = await User.findOne({
            where: {
                id: userid,
            },
            include: Servicos,
            plain: true,
        })

        // check if user exists
        if (!user) {
            res.redirect('/login')
        }

        const servicos = user.Servicos.map((result) => result.dataValues)

        let emptyServico = true

        if (servicos.length === 0) {
            emptyServico = false
        }

        console.log(servicos)

        res.render('servicos/dashboard', { servicos, emptyServico })
    }

    static createServico(req, res) {
        res.render('servicos/create')
    }

    static async createServicoSave(req, res) {

        const Servico = {
            title: req.body.title,
            UserId: req.session.userid,
        }

        try {

            await Servicos.create(Servico)
    
            req.flash('info', `Servico ${req.body.title} criado com sucesso`);
    
            req.session.save(() => {
                res.redirect('/servicos/dashboard')
            })
            
        } catch (error) {
            console.log('Aconteceu um erro: ' + error)
        }   

    }

    static async removeServico(req, res) {

        const id = req.body.id
        const UserId = req.session.userid

        try {

            await Servicos.destroy({ where: { id: id, UserId: UserId} })

            req.flash('info', 'Serviço removido com sucesso')

            req.session.save(() => {
                res.redirect('/servicos/dashboard')
            })

        } catch (error) {
            console.log('Aconteceu um erro: ' + error)
        }

    }

    static async updateServico(req, res) {

        const id = req.params.id

        try {

            const servico = await Servicos.findOne({ where: {id: id}, raw: true})

            res.render('servicos/edit', { servico })

        } catch (error) {

            console.log('Aconteceu um erro: ' + error)

        }

    }

    static async updateServicoSave(req, res) {

        const id = req.body.id

        const servico = {
            title: req.body.title,
        }

        try {

            await Servicos.update(servico, { where: {id: id} })

            req.flash('info', 'Serviço atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/servicos/dashboard')
            })
             
        } catch (error) {

            console.log('Aconteceu um erro: ' + error)

        }

    }
}