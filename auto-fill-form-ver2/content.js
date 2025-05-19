// const script = document.createElement('script');
// script.src = chrome.runtime.getURL('inject.js');
// script.onload = function () {
//     this.remove();
// };
// document.documentElement.appendChild(script);

chrome.storage.local.get("fillRecipient", (data) => {
    const recipientEmail = data.fillRecipient;
    if (!recipientEmail) return;

    // Giai đoạn 1: Điền email vào input
    const fillInterval = setInterval(() => {
        const input = document.getElementById("fn-sendRecipient");
        if (input) {
            input.value = recipientEmail;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            clearInterval(fillInterval);

            // Giai đoạn 2: Tìm div đúng theo email và click
            const selectInterval = setInterval(() => {
                const candidateDivs = document.querySelectorAll('div[role="option"]');
                for (const div of candidateDivs) {
                    if (div.textContent.includes(recipientEmail)) {
                        div.click();
                        clearInterval(selectInterval);
                        chrome.storage.local.get("numericValue", (numericValue) => {
                            let sotien = numericValue.numericValue;
                            if (!sotien || sotien == "0.00") return;
                            const pickMol = setInterval(() => {
                                const input = document.getElementById("fn-amount");
                                if (!input) return;
                                const mol = sotien;
                                // Dùng setter gốc để đặt giá trị (tránh bị React/Vue bỏ qua)
                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                nativeInputValueSetter.call(input, mol);

                                // Tạo InputEvent chuẩn mà React chấp nhận
                                const inputEvent = new InputEvent('input', {
                                    bubbles: true,
                                    cancelable: true,
                                    inputType: 'insertText',
                                    data: mol, // Dữ liệu gõ, giúp tăng độ tin cậy
                                });

                                // Gửi sự kiện input
                                input.dispatchEvent(inputEvent);
                                clearInterval(pickMol);

                                const buttons = document.querySelectorAll('button');
                                for (const btn of buttons) {
                                    if (btn.textContent.trim() === 'Next') {
                                        btn.click();
                                        const inter2 = setInterval(() => {


                                            const personalLabel = document.querySelector('label[for="selection_paymentType_PERSONAL"]');
                                            if (personalLabel) {
                                                personalLabel.click();
                                                clearInterval(inter2);

                                                const inter3 = setInterval(() => {
                                                    const buttons = document.querySelectorAll('button');
                                                    for (const btn of buttons) {
                                                        if (btn.textContent.trim() === 'Continue') {
                                                            clearInterval(inter3);
                                                            btn.click();
                                                            break;
                                                        }
                                                    }
                                                }, 300);
                                            }
                                        }, 300);

                                        break;  // click xong thì dừng
                                    }
                                }

                                chrome.storage.local.remove("fillRecipient");
                                chrome.storage.local.remove("numericValue");

                                return

                            }, 300);
                        });

                        // Dọn dẹp
                        return;
                    }
                }
            }, 300);
        }
    }, 300);
});


