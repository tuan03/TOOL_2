const fs = require('fs');

const newData = {
  email: 'test@example.com',
  times: 3,
  amount: '$1,23',
  link: 'https://example.com/payment'
};

// Chuyển object thành chuỗi dạng tab-separated (cách nhau bằng tab \t)
const line = `${newData.email}\t${newData.times}\t${newData.amount}\t${newData.link}\n`;

// Append dữ liệu vào file output.txt
fs.appendFile('output.txt', line, (err) => {
  if (err) {
    console.error('Lỗi khi ghi file:', err);
  } else {
    console.log('Đã append dữ liệu thành công!');
  }
});
