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
let mailIsGetLink = true
app.get("/random-email", async (req, res) => {
  let dataRandom = generateCccd()
  emailRandom = dataRandom.email
  mailIsGetLink = false
  res.json({ email: emailRandom })
})
app.get("/get-random", (req, res) => {
  dataRandom = generateCccd()
  dataRandom.password = "Phongbk!"
  dataRandom.emailNhan = "anhphongbkdn123@gmail.com"
  dataRandom.email = emailRandom
  console.log(dataRandom.email)
  dataSaving = dataRandom
  res.json(dataRandom)
})
const myProxy = [
  {
    linkChange: "https://api.enode.vn/getip/8cd22487b888e9f949d64cce2df75aa6eb9aeb2f",
    proxy: "http://117.1.95.243:48561"
  },
  {
    linkChange: "https://api.enode.vn/getip/f1ace187f8792c19da32732678ff1679e187ffdc",
    proxy: "http://117.1.95.227:47672"
  }
]; // 1 rảnh, 0 bận

let currentIndex = 0;
app.get("/get", (req, res) => {
  proxy = myProxy[currentIndex].proxy
  linkChange = myProxy[currentIndex].linkChange
  if (dataSaving) {
    dataSaving.proxy = proxy
    dataSaving.linkChange = linkChange
  }
  res.json(dataSaving || { proxy, linkChange })
})



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




const fs = require('fs').promises;
let results = []

async function readData() {
  const rawData = await fs.readFile('./data.txt', 'utf-8');
  // Tách từng dòng
  const lines = rawData
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== '');
  results = lines.map(line => {
    const [email, times, amount, link] = line.split('\t');
    return {
      email,
      times: parseInt(times),
      amount,
      link,
      emailNhan: null,
    };
  });
}
readData()

// Chuyển từng dòng thành object

let temp = null

app.get("/getLink", async (req, res) => {
  try {
    if (!emailRandom) {
      return res.json({ error: "Chưa có email" });
    }

    if (mailIsGetLink) {
      return res.json(temp);
    }

    if (results.length < 2) {
      return res.json({ error: "No more links available" });
    }

    // Lấy 2 phần tử đầu tiên
    const firstLink = results.shift();
    const secondLink = results.shift();

    // Gán email nhận
    firstLink.emailNhan = emailRandom;
    secondLink.emailNhan = emailRandom;

    const data = {
      firstLink: firstLink.link,
      secondLink: secondLink.link
    };

    // Dòng ghi log: emailRandom, email và amount của 2 link, cách nhau tab
    const line = `${emailRandom}\t${firstLink.email}\t${firstLink.amount}\t\t\t${secondLink.email}\t${secondLink.amount}\n`;
    const isGet = `${firstLink.email}\n${secondLink.email}\n`
    // Append file bằng promise (await cho chắc chắn ghi xong)
    await fs.appendFile('isGet.txt', isGet);
    await fs.appendFile('log.txt', line);

    mailIsGetLink = true;
    temp = data;

    res.json(data);

  } catch (err) {
    console.error("Lỗi trong /getLink:", err);
    res.json({ error: "Server error" });
  }
});

app.get("/saveMail", async (req, res) => {
  try {
    if (!emailRandom) {
      return res.json({ error: "Chưa có email" });
    }
    if (!mailIsGetLink) {
      return res.json({ error: "Chưa có link" });
    }
    const isGet = `${emailRandom}\n`
    await fs.appendFile('saveEmail.txt', isGet);
    res.json({ success: "Lưu mail thành công" });
  } catch (err) {
    res.json({ error: "Server error" });
  }
});