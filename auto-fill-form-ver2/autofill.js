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
async function getData() {
    const mt = await fetch("http://localhost:3000/get")
    const data = await mt.json()
    return data
}

async function randData() {
    const mt = await fetch("http://localhost:3000/get-random")
    const data = await mt.json()
    alert(data.email)
    return data
}
randData().then((data) => {
    setInterval(async () => {
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


    const btn = document.getElementById('paypalAccountData_submit');
    if (btn) {
    btn.click();
    }

    const btn2 = document.getElementById('paypalAccountData_emailPassword');
    if (btn2) {
    btn2.click();
    }


}, 1000);
})