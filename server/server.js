const generateCccd = require("./gen")
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.listen(3000)
dataSaving = null
app.get("/get-random",(req,res)=>{
    dataRandom = generateCccd()
    console.log(dataRandom.email)
    dataSaving = dataRandom
    res.json(dataRandom)
})

app.get("/get",(req,res)=>{
    res.json(dataSaving || {})
})