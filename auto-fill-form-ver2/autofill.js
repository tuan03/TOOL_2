(function () {
  function initToastSystem() {
    const container = document.createElement('div');
    container.style.position = 'fixed'; // fixed để dính góc màn hình
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999'; // đủ lớn để nằm trên tất cả
    container.style.pointerEvents = 'none'; // không chặn click của phần tử bên dưới
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end'; // canh phải
    container.style.gap = '10px'; // cách đều toast, thay vì margin-bottom

    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .toast {
        background: linear-gradient(135deg, #2a2a2a, #3c3c3c);
        color: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        min-width: 200px;
        max-width: 320px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideIn 0.4s ease-out forwards;
        opacity: 0;
        pointer-events: auto; /* cho phép tương tác */
        transition: all 0.2s ease;
      }
      .toast.exiting {
        animation: slideOut 0.4s ease-in forwards;
      }
      .toast:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
      }
      .toast-content {
        flex-grow: 1;
        margin-right: 10px;
      }
      .close-btn {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 14px;
        cursor: pointer;
        opacity: 0.7;
        padding: 0 4px;
      }
      .close-btn:hover {
        opacity: 1;
      }
      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(100%); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideOut {
        0% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100%); }
      }
      @media (max-width: 480px) {
        .toast {
          min-width: 160px;
          max-width: 90vw;
          font-size: 14px;
        }
      }
    `;
    shadow.appendChild(style);

    window.showToast = function (message, duration = 4000) {
      const toast = document.createElement('div');
      toast.className = 'toast';

      const content = document.createElement('span');
      content.className = 'toast-content';
      content.textContent = message;
      toast.appendChild(content);

      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.textContent = '×';
      closeBtn.onclick = () => {
        toast.classList.add('exiting');
        setTimeout(() => toast.remove(), 400);
      };
      toast.appendChild(closeBtn);

      shadow.appendChild(toast);

      // Auto-remove sau duration
      setTimeout(() => {
        toast.classList.add('exiting');
        setTimeout(() => toast.remove(), 400);
      }, duration);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToastSystem);
  } else {
    initToastSystem();
  }
})();


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
    if (el) {
        el.value = val;
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
};

const check = (id) => {
    const el = document.getElementById(id);
    if (el && !el.checked) {
        el.click(); // mô phỏng hành vi người dùng
    }
};

async function getData() {
    const mt = await fetch("http://localhost:3000/get");
    const data = await mt.json();
    return data;
}





async function randData() {
    // const userConfirm = confirm("Bạn có muốn auto điền thông tin không?");

    // if (!userConfirm) {
    //     return null;
    // }

    try {
        const temp = await fetch("http://localhost:3000/random-email");
        const emailData = await temp.json();
        if (emailData.error) {
            showToast(emailData.error);
            return null;
        }
        const mt = await fetch("http://localhost:3000/get-random");
        const data = await mt.json();
        if (data.error) {
            showToast(data.error);
            return null;
        }
        return data;
    } catch (err) {
        showToast("Lỗi kết nối đến server: " + err.message);
        return null;
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


randData().then((userAcceptedData) => {
    if (!userAcceptedData) return; // Nếu người dùng không muốn auto thì dừng lại

    document.addEventListener('mousedown', async function (event) {
        const data = await getData();
        if (event.button === 0) {
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
            await delay(400); // Đợi 1 giây trước khi click
            const btn = document.getElementById('paypalAccountData_submit');
            if (btn) btn.click();

            const btn2 = document.getElementById('paypalAccountData_emailPassword');
            if (btn2) btn2.click();
            const finall = document.getElementById('paypalAccountData_intentSelectionHeading');
            if (finall) {
                clearInterval(myInterval);
                window.location.assign("https://www.paypal.com");
            }
        } else if (event.button === 2) {
            const myInterval = setInterval(async () => {
                const data = await getData();
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
                await delay(400); // Đợi 1 giây trước khi click
                const btn = document.getElementById('paypalAccountData_submit');
                if (btn) btn.click();

                const btn2 = document.getElementById('paypalAccountData_emailPassword');
                if (btn2) btn2.click();

                const finall = document.getElementById('paypalAccountData_intentSelectionHeading');
                if (finall) {
                    clearInterval(myInterval);
                    window.location.assign("https://www.paypal.com");
                }
            }, 300);


        }
    });
});
