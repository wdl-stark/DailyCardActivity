
export default class HttpUtils {

	public httpGets(url: string, callback: any) {
		let xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				let respone = xhr.responseText;
				callback(respone);
			}
			// else {
			//     callback(-1);
			// }
		};
		xhr.open("GET", url, true);
		// xhr.setRequestHeader("Origin", "http://test.zjhaa.cn");
		// xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
		// note: In Internet Explorer, the timeout property may be set only after calling the open()
		// method and before calling the send() method.
		xhr.timeout = 5000;// 5 seconds for timeout
		xhr.send();
	}

	public httpPost(url: string, params: any, callback: any) {
		let xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = function () {
			cc.log('xhr.readyState=' + xhr.readyState + '  xhr.status=' + xhr.status);
			let responeLog = xhr.responseText;
			console.log("responeLog: ", responeLog);
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				let respone = xhr.responseText;
				callback(respone);
			} else {
				callback(-1);
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("content-type", "application/json");
		// xhr.setRequestHeader("x-device_id", GLOBAL.getSimId(false, 16));
		// note: In Internet Explorer, the timeout property may be set only after calling the open()
		// method and before calling the send() method.
		xhr.timeout = 5000;// 5 seconds for timeout
		let sendstr = JSON.stringify(params);
		
		console.log("sendstr", sendstr);
		xhr.send(sendstr);
	}

	public httpPost_EX(url: string, params: any, callback: any) {
		let xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				let respone = xhr.responseText;
				callback(respone);
			} else {
				callback(-1);
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("content-type", "application/json");
		// xhr.setRequestHeader("x-device_id", GLOBAL.getSimId(false, 16));
		// xhr.setRequestHeader("x-token", GLOBAL.loginInfo.token);
		// xhr.setRequestHeader("x-user_id", GLOBAL.UID.toString());
		xhr.timeout = 5000;// 5 seconds for timeout
		let sendstr = JSON.stringify(params);
		xhr.send(sendstr);
	}

	public httpPost_Up(url: string, params: any, callback: any) {
		let xhr = cc.loader.getXMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
				let respone = xhr.responseText;
				callback(respone);
			} else {
				callback(-1);
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("content-type", "application/json");
		xhr.setRequestHeader("x-device_id", "");
		
		// xhr.setRequestHeader("x-user_id", GLOBAL.UID.toString());
		xhr.timeout = 5000;// 5 seconds for timeout
		let sendstr = JSON.stringify(params);
		xhr.send(sendstr);
	}
}