const generateCccd = require("./gen")
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.listen(3000)
dataSaving = null
app.get("/get-random",(req,res)=>{
    dataRandom = generateCccd()
    dataRandom.password = "Phongbk!"
    
    console.log(dataRandom.email)
    dataSaving = dataRandom
    res.json(dataRandom)
})

app.get("/get",(req,res)=>{
    proxy = "http://27.76.206.175:16419"
    if(dataSaving) dataSaving.proxy = proxy
    res.json(dataSaving || {proxy })
})