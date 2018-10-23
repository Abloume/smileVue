const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const { connect, initSchemas } = require('./database/init.js')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const Router = require('koa-router')

app.use(bodyParser())
app.use(cors())

let user = require('./appApi/User')
let goods = require('./appApi/goods')

let router = new Router()
router.use('/user', user.routes())
router.use('/goods', goods.routes())

app.use(router.routes())
app.use(router.allowedMethods())

// 立即执行函数
;(async()=>{
    await connect()
    initSchemas()
})()

app.use(async(ctx)=>{
    ctx.body = '<h1>Hello Koa2~</h1>'
})

app.listen(3000, ()=>{
    console.log('server starting at port 3000...')
})