// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "set-proxy") {
//     try {
//       const url = new URL(message.proxyUrl);
//       chrome.proxy.settings.set(
//         {
//           value: {
//             mode: "fixed_servers",
//             rules: {
//               singleProxy: {
//                 scheme: url.protocol.replace(":", ""),
//                 host: url.hostname,
//                 port: parseInt(url.port)
//               },
//               bypassList: ["localhost"]
//             }
//           },
//           scope: "regular"
//         },
//         () => {
//           console.log("Proxy set successfully.");
//         }
//       );
//     } catch (e) {
//       console.error("Invalid proxy URL", e);
//     }
//   } else if (message.type === "disable-proxy") {
//     chrome.proxy.settings.clear({ scope: "regular" }, () => {
//       console.log("Proxy disabled.");
//     });
//   }
// });

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
          sendResponse({ success: true });
        }
      );
    } catch (e) {
      console.error("Invalid proxy URL", e);
      sendResponse({ success: false, error: e.message });
    }
    return true; // 👈 BẮT BUỘC khi sendResponse được gọi bất đồng bộ
  } else if (message.type === "disable-proxy") {
    chrome.proxy.settings.clear({ scope: "regular" }, () => {
      console.log("Proxy disabled.");
      sendResponse({ success: true });
    });
    return true; // 👈 Cần return true ở đây nữa
  }
});
