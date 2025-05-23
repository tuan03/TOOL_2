
let currentData = {};
function showAlert(msg) {
    const alertDiv = document.getElementById('myAlert');
    alertDiv.textContent = msg;
    alertDiv.style.display = 'block';

    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 2000);  // 100ms tự động ẩn
}
function updateInfo() {
    const { cccd, tinh, gioi_tinh, birth, tinh_zip, address, town, family, middle, given, sdt, email, password, linkChange } = currentData;
    const copyDiv = document.getElementById("copyDiv")
    copyDiv.innerText = email
    const resetProxy = document.getElementById("resetProxy")
    resetProxy.addEventListener("click", async function () {
        const mt = await fetch(linkChange)
        const data = await mt.json()
        if (data.error) {
            showAlert(data.error);
            return
        }
        showAlert(data.message);
    })
    document.getElementById("info").innerText = `
📧 Email: ${email}
🔒 Mật khẩu: ${password}
👤 Họ tên: ${family} ${middle} ${given}
🆔 CCCD: ${cccd}
📞 SĐT: ${sdt}
🗓️ Ngày sinh: ${birth} (${gioi_tinh})
🏡 Địa chỉ: ${address}, ${town}, ${tinh} (ZIP: ${tinh_zip})
`;
}

// Gửi script inject vào tab hiện tại
function runStep(step) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (step, data) => {

                if (step == 10000) {
                    const width = 900;
                    const height = 600;
                    const left = (window.screen.width / 2) - (width / 2);
                    const top = (window.screen.height / 2) - (height / 2);

                    const popup = window.open(
                        "/myaccount/summary",
                        "popupWindow",
                        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
                    );

                    // Dùng setInterval để chờ popup load xong và an toàn hơn
                    const interval = setInterval(() => {
                        try {
                            if (popup.document && popup.document.readyState === "complete") {
                                clearInterval(interval);
                                console.log("Popup đã mở thành công!");
                                const myTick = setInterval(() => {
                                    const elements = popup.document.querySelectorAll('.isCredit.txn_amt_font.css-1pmwpmb-text_body.css-1in6wbk-RichText');
                                    console.log("elements", elements)
                                    if (elements.length > 0) {
                                        clearInterval(myTick);
                                    }
                                    elements.forEach((el, index) => {
                                        const text = el.textContent.trim();
                                        const value = parseFloat(text.replace(/[^\d.]/g, ''));
                                        console.log(value);
                                    });
                                    popup.close();

                                }, 1000);

                            }
                        } catch (err) {
                            // Nếu khác origin, việc truy cập sẽ ném lỗi và vào đây
                            console.warn("Không thể truy cập popup do khác origin hoặc chưa sẵn sàng.");
                        }
                    }, 500);

                    return;
                }

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
                    console.log("kkk", el)
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
                fill('paypalAccountData_email', data.email);
                fill('paypalAccountData_phone', data.sdt);
                fill('paypalAccountData_password', data.password);
                fill('paypalAccountData_lastName', data.family);
                fill('paypalAccountData_middleName', data.middle);
                fill('paypalAccountData_firstName', data.given);
                fill('paypalAccountData_identificationNum', data.cccd);
                fill('paypalAccountData_dob', data.birth);
                fill('paypalAccountData_address1_0', data.address);
                fill('paypalAccountData_city_0', data.town);
                fillSelect('dropdownMenuSelect_paypalAccountData_state_0', data.tinh);
                fill('paypalAccountData_zip_0', data.tinh_zip);
                check('paypalAccountData_termsAgree');
                check('paypalAccountData_marketingOptIn');

                if (step == 100) {
                    window.location.assign(`https://www.paypal.com`)
                }

                if (step == 1000) {
                    const balanceElement = document.querySelector('[data-test-id="available-balance"]');
                    if (balanceElement) {
                        const rawText = balanceElement.textContent.trim(); // "$0.00"
                        const numericValue = rawText.replace(/[^0-9.]/g, ''); // 0.00
                        // alert("Xác nhận chuyển tiền: " + numericValue)
                        chrome.storage.local.set({ fillRecipient: data.emailNhan, numericValue: numericValue }, () => {
                            window.location.assign("https://www.paypal.com/myaccount/transfer/homepage/pay");
                        });
                    }

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
    function sendMessageAsync(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    document.getElementById("nextProxy").addEventListener("click", async () => {
        try {
            await sendMessageAsync({ type: "disable-proxy" });

            const response = await fetch("http://localhost:3000/getProxy");
            const data = await response.json();
            const { currentProxy, nextProxy } = data;

            const changeResponse = await fetch(currentProxy.linkChange);
            const changeData = await changeResponse.json();

            if (changeData.error) {
                await sendMessageAsync({
                    type: "set-proxy",
                    proxyUrl: currentProxy.proxy
                });
                showAlert(changeData.error);
                return;
            }

            await sendMessageAsync({
                type: "set-proxy",
                proxyUrl: nextProxy.proxy
            });

            showAlert(changeData.message);

        } catch (error) {
            showAlert("Đã xảy ra lỗi: " + error.message);
        }
    });


    const btn = document.getElementById("natsteps");
    btn.onclick = () => runStep(1);

    const btn2 = document.getElementById("goHome");
    btn2.onclick = () => runStep(100);

    const btn3 = document.getElementById("sentMoney");
    btn3.onclick = () => runStep(1000);

    const testingButton = document.getElementById("testing");
    testingButton.onclick = () => runStep(10000);

    document.getElementById("gen").onclick = async () => {
        const mt = await fetch("http://localhost:3000/get-random")
        const data = await mt.json()
        currentData = data;
        updateInfo();
    };
    document.getElementById("openTabs").addEventListener("click", () => {
        const textarea = document.getElementById("linkurl");
        const lines = textarea.value.split(/\r?\n/);
        const links = lines
            .map(line => line.trim())
            .filter(line => line !== "");
        links.forEach(link => {
            chrome.tabs.create({ url: link });
        });
    });
    fetch("https://api.ipify.org?format=json") // Gửi yêu cầu GET đến IP API
        .then(response => response.json())     // Chuyển đổi kết quả thành JSON
        .then(data => {
            const myip = document.getElementById("myip"); // Lấy thẻ input có id "myip"
            myip.textContent = data.ip;                         // Gán giá trị IP vào input
        })
        .catch(error => {
            const myip = document.getElementById("myip");
            myip.textContent = "Lỗi Lấy Ip";                    // Ghi thông báo lỗi nếu fetch thất bại
        });

    // Khởi tạo dữ liệu lần đầu
    const mt = await fetch("http://localhost:3000/get")
    const data = await mt.json()
    currentData = data;
    updateInfo();
    console.log(currentData)
    const proxyUrl = document.getElementById("proxyUrl");
    if (proxyUrl) {
        proxyUrl.value = currentData.proxy
    }
    const copyDiv = document.getElementById("copyDiv")
    copyDiv.addEventListener("click", function () {
        const text = this.textContent;
        navigator.clipboard.writeText(text)
            .then(() => {
                const textContent = copyDiv.textContent
                copyDiv.textContent = "Đã sao chép"
                setTimeout(() => {
                    copyDiv.textContent = textContent
                }, 300)
            })
            .catch(err => {
                console.error("Lỗi sao chép: ", err);
            });
    });



    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            e.preventDefault();
            document.getElementById('nextProxy').click();
        }
        // if (e.key.toLowerCase() === 'q') {
        // document.getElementById('natsteps').click();
        // }
        if (e.key.toLowerCase() === 'c') {
            document.getElementById('sentMoney').click();
        }
        if (e.key.toLowerCase() === 'z') {
            document.getElementById('copyDiv').click();
        }
    });




});

