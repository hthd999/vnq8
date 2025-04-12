document.addEventListener("DOMContentLoaded", () => {
    const loadingElement = document.getElementById("loading");
    const messageElement = document.getElementById("message");

    // 域名列表（生成随机二级域名前）
    const baseDomains = [
        "aok88.com",
        "gok88.com",
        "chv88.me",
    ];

    // 显示加载动画
    loadingElement.style.display = "block";

    // 动态生成带随机二级域名的列表
    const randomDomains = baseDomains.map(domain => generateRandomSubdomain(domain));

    // 开始检测域名
    checkDomains(randomDomains, (availableDomain) => {
        // 一旦检测到可用域名，停止动画并跳转
        loadingElement.style.display = "none";
        //messageElement.textContent = `Good找到可用域名，即将跳转到：${availableDomain}`;
        window.location.href = availableDomain; // 跳转到找到的域名
    }, () => {
        // 如果所有域名都不可用
        loadingElement.style.display = "none";
        // messageElement.textContent = "检测失败，无法找到可用域名！";
    });
});

/**
 * 生成随机的二级域名
 * @param {string} domain 域名
 * @returns {string} 返回带随机二级域名的完整域名
 */
function generateRandomSubdomain(domain) {
    const randomString = Math.random().toString(36).substring(2, 8); // 生成随机字符串
    //return `https://${randomString}.${domain}`;
    return `https://${domain}`;
}

/**
 * 检测域名列表
 * @param {string[]} domains 域名列表
 * @param {function} onSuccess 找到可用域名时执行的回调
 * @param {function} onFailure 所有域名不可访问时执行的回调
 */
function checkDomains(domains, onSuccess, onFailure) {
    let found = false; // 是否已找到可用域名
    let pendingCount = domains.length; // 剩余待检测的域名数量

    domains.forEach((domain) => {
        // 开始检测单个域名
        checkDomainAvailability(domain).then((isAvailable) => {
            if (isAvailable && !found) {
                found = true; // 标记为已找到可用域名
                onSuccess(domain); // 执行成功回调
            }
        }).catch(() => {
            // 忽略任何错误
        }).finally(() => {
            pendingCount--;

            // 如果全部检测完成且仍未找到可用域名
            if (!found && pendingCount === 0) {
                onFailure(); // 执行失败回调
            }
        });
    });
}

/**
 * 检测单个域名是否可用
 * @param {string} domain 域名
 * @returns {Promise<boolean>} 返回一个 Promise，表示域名是否可访问
 */
function checkDomainAvailability(domain) {
    return new Promise((resolve) => {
        fetch(domain, { method: "HEAD", mode: "no-cors" })
            .then(() => resolve(true)) // 可访问
            .catch(() => resolve(false)); // 不可访问
    });
}