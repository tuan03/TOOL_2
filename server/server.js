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
    proxy = "http://117.1.89.248:59483"
    linkChange = "https://api.enode.vn/getip/8157bf8bef02bbbb73c54a779aa2b590e011dad0"
    if(dataSaving) {
        dataSaving.proxy = proxy
        dataSaving.linkChange = linkChange
    }
    res.json(dataSaving || {proxy , linkChange})
})