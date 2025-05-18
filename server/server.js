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
    proxy = "http://171.229.250.177:62848"
    linkChange = "https://api.enode.vn/getip/dad9a33fb43c4206e56b6a4e0f88b42838660757"
    if(dataSaving) {
        dataSaving.proxy = proxy
        dataSaving.linkChange = linkChange
    }
    res.json(dataSaving || {proxy , linkChange})
})