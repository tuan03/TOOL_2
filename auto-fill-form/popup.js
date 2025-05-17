
let currentData = {};

function updateInfo() {
    const { cccd, tinh, gioi_tinh, birth, tinh_zip, address, town, family, middle, given, sdt, email,password } = currentData;
    document.getElementById("info").innerText = `
Email: ${email}
Password: ${password}
👤 ${family} ${middle} ${given}
🆔 ${cccd}
📞 ${sdt}
🗓️ ${birth} - ${gioi_tinh}
🏡 ${address}, ${town}, ${tinh} (${tinh_zip})
  `.trim();
}

// Gửi script inject vào tab hiện tại
function runStep(step) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (step, data) => {
                // inject vào trang web
                const fill = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.value = val;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                };
                const fillSelect = (id, val) => {
                    const el = document.getElementById(id);
                    console.log("kkk",el)
                    if (el) {
                    el.value = val;
                    const event = new Event('change', { bubbles: true });
                    el.dispatchEvent(event);
                    }

                }
                const check = (id) => {
                    const el = document.getElementById(id);
                    if (el && !el.checked) {
                        el.click(); // mô phỏng hành vi người dùng
                    }
                };


                switch (step) {
                    case 1:
                        fill('paypalAccountData_email', data.email);

                        break;
                    case 2:
                        fill('paypalAccountData_phone', data.sdt);
                        break;
                    case 3:
                        fill('paypalAccountData_password', data.password);
                        break;
                    case 4:
                        fill('paypalAccountData_lastName', data.family);
                        fill('paypalAccountData_middleName', data.middle);
                        fill('paypalAccountData_firstName', data.given);
                        break;
                    case 5:
                        fill('paypalAccountData_identificationNum', data.cccd);
                        fill('paypalAccountData_dob', data.birth);
                        break;
                    case 6:
                        fill('paypalAccountData_address1_0', data.address);
                        fill('paypalAccountData_city_0', data.town);
                        fillSelect('dropdownMenuSelect_paypalAccountData_state_0', data.tinh);
                        fill('paypalAccountData_zip_0', data.tinh_zip);
                        check('paypalAccountData_termsAgree');
                        check('paypalAccountData_marketingOptIn');
                        break;
                    case 7:
                        window.location.assign(`https://www.paypal.com`)

                }
            },
            args: [step, currentData]
        });
    });
}

// Khi popup mở
document.addEventListener("DOMContentLoaded", async () => {
     document.getElementById("setProxy").addEventListener("click", () => {
    const proxyUrl = document.getElementById("proxyUrl").value;

    chrome.runtime.sendMessage({
      type: "set-proxy",
      proxyUrl: proxyUrl
    });
  });

  document.getElementById("disableProxy").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "disable-proxy" });
  });

  
    const stepsDiv = document.getElementById("steps");
    for (let i = 1; i <= 7; i++) {
        const btn = document.createElement("button");
        switch (i){
            case 1: 
                btn.innerText = `🚀 Điền Email`;
                break;
            case 2:
                btn.innerText = `🚀 Điền Số điện thoại`;
                break;
            case 3:
                btn.innerText = `🚀 Điền Mật khẩu`;
                break;
            case 4:
                btn.innerText = `🚀 Điền Họ Và Tên`;
                break;
            case 5:
                btn.innerText = `🚀 Điền CCCD và NS`;
                break;
            case 6:
                btn.innerText = `🚀 Điền Địa Chỉ`;
                break;
            case 7:
                btn.innerText = `Đến trang chủ`;
                break;
        }   
        btn.onclick = () => runStep(i);
        stepsDiv.appendChild(btn);
    }

    document.getElementById("gen").onclick = async () => {
        const mt = await fetch("http://localhost:3000/get-random")
        const data = await mt.json()
        currentData = data;
        updateInfo();
    };

    // Khởi tạo dữ liệu lần đầu
    const mt = await fetch("http://localhost:3000/get")
    const data = await mt.json()
    currentData = data;
    updateInfo();
    console.log(currentData)
    const proxyUrl = document.getElementById("proxyUrl");
    if (proxyUrl){
        proxyUrl.value = currentData.proxy
    }
});

