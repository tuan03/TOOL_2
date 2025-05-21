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
    dataRandom.emailNhan = "anhphongbkdn123@gmail.com"
    console.log(dataRandom.email)
    dataSaving = dataRandom
    res.json(dataRandom)
})

app.get("/get",(req,res)=>{
    proxy = "http://117.5.220.79:54564"
    linkChange = "https://api.enode.vn/getip/e1e03e8ab45c844e0257a406934b76591684a8a3"
    if(dataSaving) {
        dataSaving.proxy = proxy
        dataSaving.linkChange = linkChange
    }
    res.json(dataSaving || {proxy , linkChange})
})