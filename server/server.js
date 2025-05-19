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
    proxy = "http://117.1.89.136:41444"
    linkChange = "https://api.enode.vn/getip/949c55e030ed612b55dce75d64eba7b5de4eb1e0"
    if(dataSaving) {
        dataSaving.proxy = proxy
        dataSaving.linkChange = linkChange
    }
    res.json(dataSaving || {proxy , linkChange})
})