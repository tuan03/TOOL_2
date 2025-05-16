chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "set-proxy") {
    try {
      const url = new URL(message.proxyUrl);
      chrome.proxy.settings.set(
        {
          value: {
            mode: "fixed_servers",
            rules: {
              singleProxy: {
                scheme: url.protocol.replace(":", ""),
                host: url.hostname,
                port: parseInt(url.port)
              },
              bypassList: ["localhost"]
            }
          },
          scope: "regular"
        },
        () => {
          console.log("Proxy set successfully.");
        }
      );
    } catch (e) {
      console.error("Invalid proxy URL", e);
    }
  } else if (message.type === "disable-proxy") {
    chrome.proxy.settings.clear({ scope: "regular" }, () => {
      console.log("Proxy disabled.");
    });
  }
});
