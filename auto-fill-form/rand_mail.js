function generateRealisticEmail() {
    const firstNames = ["nguyen", "tran", "le", "pham", "hoang", "dang", "vu", "do", "bui", "truong"];
    const lastNames = ["an", "binh", "chi", "duong", "giang", "hoa", "khanh", "lam", "minh", "nam"];
    const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com", "protonmail.com"];

    function randomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomNumber(length = 2) {
        return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    }

    const first = randomElement(firstNames);
    const last = randomElement(lastNames);
    const separators = ["", ".", "_"];
    const separator = randomElement(separators);
    const number = Math.random() < 0.6 ? randomNumber(2) : ""; // 60% có số

    const username = `${first}${separator}${last}${number}`;
    const domain = randomElement(emailDomains);

    return `${username}@${domain}`;
}

