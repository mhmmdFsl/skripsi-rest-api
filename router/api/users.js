const express = require('express')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const sql = require('../../model/db')
const Users = require('../../model/Users')

const secretToken = "yr7dhdm2fkzs6pvzzovaa7qory6betzm"

router.post('/register', [body('name').isLength({min:3, max: 50}).withMessage("Nama minimal 3 karakter"),
                body('name').notEmpty().withMessage("Nama tidak boleh kosong"),
                body('email').isEmail().normalizeEmail().withMessage("Maukan Email yang benar").notEmpty().withMessage("Email tidak boleh kosong"),
                body('password').isLength({min:6, max:50}).withMessage("Password minimal 6 karakter").notEmpty().withMessage("Password tidak boleh kosong"),
                body('password2').notEmpty().withMessage("Konfirmasi password"),
                body('password2').custom((value, {req}) => {
                    if (value !== req.body.password) {
                        throw new Error('Password tidak sama')
                    }

                    return true
                })],
                (req, res) => {
                    const error = validationResult(req)

                    if(!error.isEmpty()) {
                        return res.status(400).json(error)
                    }

                    sql.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, data) => {
                        if (data.length) {
                            return res.status(400).json({message: 'Email sudah terdaftar'})
                        } else {
                            const newUser = new Users({
                                name : req.body.name,
                                email : req.body.email,
                                password : req.body.password,
                                role : 'user'
                            })

                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err

                                    newUser.password = hash
                                    Users.create(newUser, (err, data) => {
                                        if (err) {
                                            return res.status(500).json({
                                                message : "Error while creating new user"
                                            })
                                        } else {
                                            return res.json({
                                                message: 'success',
                                                token: jwt.sign({email: newUser.email, role: newUser.role}, secretToken)
                                            })
                                        }
                                    })
                                })
                            })
                        }
                    })

                })

router.post('/login',[body('email').isEmail().normalizeEmail().withMessage("Masukan Email yang benar"),
            body('email').notEmpty().withMessage("Email tidak boleh kosong"),
            body('password').isLength({min:3}).withMessage("Password  minimal 6 karakter"),
            body('password').notEmpty().withMessage("Password tidak boleh kosong")], 
            (req, res) => {
                const err = validationResult(req)

                if(!err.isEmpty()) {
                    return res.status(400).json(err)
                }

                sql.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, data) => {
                    if (err) throw err

                    if (data.length) {
                        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
                            if (err) throw err
                            
                            if (result) {
                                return res.json({token: jwt.sign({email: data.email, role: data.role}, secretToken)})
                            } else {
                                return res.status(400).json({message: 'Password salah'})
                            }
                        })
                    } else {
                    
                        return res.status(400).json({message: 'email belum terdaftar'})
                    }
                })

})

module.exports = router