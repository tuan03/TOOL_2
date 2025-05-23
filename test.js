const data = ["0.19", "0.10"];


function sumAmountsFromDivs(data) {
  let totalCents = 0;

  data.forEach(item => {
    const text = item.trim(); // ví dụ: "+$0.19"
    const value = parseFloat(text); // tách 0.19
    const cents = Math.round(value * 100); // chuyển sang cent để cộng chính xác
    totalCents += cents;
  });

  return (totalCents / 100).toFixed(2); // trả về chuỗi định dạng 2 số sau dấu chấm
}

console.log(sumAmountsFromDivs(data)); // Kết quả: "0.99"