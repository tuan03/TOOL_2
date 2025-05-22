const generateCccd = require("./gen")
const express = require("express")
const app = express()
const cors = require("cors")
const axios = require('axios');
const e = require("express");
app.use(cors())
app.listen(3000)
dataSaving = null

let emailRandom = null
app.get("/random-email", async (req, res) => {
    let dataRandom = generateCccd()
    emailRandom = dataRandom.email
    res.json({ email: emailRandom })
})
app.get("/get-random",(req,res)=>{
    dataRandom = generateCccd()
    dataRandom.password = "Phongbk!"
    dataRandom.emailNhan = "anhphongbkdn123@gmail.com"
    dataRandom.email = emailRandom
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

const myProxy = [
  {
    linkChange: "https://api.enode.vn/getip/445dc1f9ab3a8cd1e81777adfb8aa626838c36c8",
    proxy: "http://117.0.207.178:27280"
  },
  {
    linkChange: "https://api.enode.vn/getip/aeb05e1ce25fd060329af9702d468fc546515e23",
    proxy: "http://117.0.207.178:44343"
}
]; // 1 rảnh, 0 bận

let currentIndex = 0;

app.get("/getProxy", async (req, res) => {
const currentProxy = myProxy[currentIndex];
  currentIndex++;
  currentIndex = currentIndex % myProxy.length; // tăng chỉ số lên 1 và quay lại đầu nếu vượt quá độ dài
  const nextProxy = myProxy[currentIndex]; // lấy proxy tiếp theo
  res.json({
    currentProxy,
    nextProxy
  });
});
