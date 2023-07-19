const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res){
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        
        const {email, password} = req.body
        
        // find user
        const user = await User.findOne({where: { email: email}})

       
        if(!user) {
            // message
            req.flash('danger', 'Usuário não encontrado')
            res.render('auth/login')
            return
        }

        // check if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            // message
            req.flash('danger', 'Senha inválida!')
            res.render('auth/login')
            return
        }

        // initialize session
        req.session.userid = user.id
        req.session.name = user.name

        req.flash('info', 'Autenticação efetuada com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })

    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        // password match validation
        if (password != confirmpassword) {
            // message
            req.flash('danger', 'As senhas não conferem. tente novamente')
            res.render('auth/register')
            return
        }

        // check if user exists
        const checkIfUserExists = await User.findOne({where: { email: email}})

        if (checkIfUserExists) {
            // message
            req.flash('danger', 'O E-mail já está em uso')
            res.render('auth/register')
            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(6)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash('info', 'Cadastro efetuado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })

        } catch (err) {
            console.log(err)
        }

    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}