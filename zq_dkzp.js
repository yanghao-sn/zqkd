/*
中青看点极速版
赞赏:邀请码 69812082 https://youth.baertt.com/user/mmsk/3fea46ea9e9fa7d0e0c66a70a547148c?uid=69812082&reward_sign=KeAgvg5DByaTWJwl0liYCri7Dgpl1QkV&avatar=http://res.youth.cn/avatar_202211_08_08b_6369b2999354069812082k.jpg&is_new=0&title_mark=1&phone_code=5fad6007308104de24016f2e11abc084&time=1700019380&app_version=1&sign=01c050561c0f9483de0373412d907568
下载地址
技术交流群，212796668、681030097
教程地址：http://cxgc.top

脚本兼容: Node.js
*/
const $ = new Env("中青极速打卡转盘");
const notify = $.isNode() ? require('./sendNotify') : '';
message = ""
let zq_cookie = $.isNode() ? (process.env.zq_cookie ? process.env.zq_cookie : "") : ($.getdata('zq_cookie') ? $.getdata(
	'zq_cookie') : "")
let zq_cookieArr = []
let zq_cookies = ""

var time = Date.parse(new Date()).toString();
var time1 = time.substr(0, 10);
if (zq_cookie) {
	if (zq_cookie.indexOf("@") == -1 && zq_cookie.indexOf("@") == -1) {
		zq_cookieArr.push(zq_cookie)
	} else if (zq_cookie.indexOf("@") > -1) {
		zq_cookies = zq_cookie.split("@")
	} else if (process.env.zq_cookie && process.env.zq_cookie.indexOf('@') > -1) {
		zq_cookieArr = process.env.zq_cookie.split('@');
		console.log(`您选择的是用"@"隔开\n`)
	}
} else if ($.isNode()) {
	var fs = require("fs");
	zq_cookie = fs.readFileSync("zq_cookie.txt", "utf8");
	if (zq_cookie !== `undefined`) {
		zq_cookies = zq_cookie.split("\n");
	} else {
		$.msg($.name, '【提示】打卡七天后"，再跑脚本', '不知道说啥好', {
			"open-url": "给您劈个叉吧"
		});
		$.done()
	}
}
Object.keys(zq_cookies).forEach((item) => {
		if (zq_cookies[item] && !zq_cookies[item].startsWith("#")) {
			zq_cookieArr.push(zq_cookies[item])
		}
	})


	!(async () => {
		console.log(`共${zq_cookieArr.length}个cookie`)
		for (let k = 0; k < zq_cookieArr.length; k++) {
			$.message = ""
			bodyVal = zq_cookieArr[k].split('&uid=')[0];
			cookie = bodyVal.replace(/zqkey=/, "cookie=")
			cookie_id = cookie.replace(/zqkey_id=/, "cookie_id=")
			zq_cookie1 = cookie_id + '&request_time=' + time1 + '&time=' + time1 + '&' + bodyVal
			//待处理cookie
			//console.log(`${zq_cookie1}`)
			console.log(`--------第 ${k + 1} 个账号转盘抽奖中--------\n`)

			console.log("\n\n")

			for (let k = 0; k < 5; k++) {
				await Rotary(zq_cookie1, cookie_id, time)
				await $.wait(6000);
				console.log("\n\n")
			}
			console.log("\n\n")
		}
	})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())
//抽奖
function Rotary(zq_cookie1, cookie_id, time) {
	return new Promise((resolve, reject) => {
		let url = {
			url: 'https://kd.youth.cn/WebApi/PunchCard/luckdraw?' + zq_cookie1,
			headers: {
				'Host': 'kd.youth.cn',
				'Referer': 'https://kd.youth.cn/WebApi/PunchCard/luckdraw?' + zq_cookie1,
				'Origin': 'https://kd.youth.cn',
				'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
				'Cookie': zq_cookie1
			},
			body: cookie_id,
		}
		$.post(url, async (err, resp, data) => {
			try {
				const result = JSON.parse(data)
				console.log(result);
				if (result.code === 1) {
					if (result.data.score !== 0) {
						console.log('好家伙！你抽中了' + result.data.score + '金币')

						//console.log('剩'+remain+'次')
					} else {
						console.log('你抽了个寂寞')
					}

				} else {
					console.log(result.msg);
					console.log('\n一般每天只有抽奖5次，过多会提示-网络异常，请稍后再试');
					// console.log('\n抽奖失败，别问我，我也不知道为啥')
				}
			} catch (e) {
				$.logErr(e + resp);
			} finally {
				resolve()
			}
		})
	})
}

function Env(t, e) {
	"undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
	class s {
		constructor(t) {
			this.env = t
		}
		send(t, e = "GET") {
			t = "string" == typeof t ? {
				url: t
			} : t;
			let s = this.get;
			return "POST" === e && (s = this.post), new Promise((e, i) => {
				s.call(this, t, (t, s, r) => {
					t ? i(t) : e(s)
				})
			})
		}
		get(t) {
			return this.send.call(this.env, t)
		}
		post(t) {
			return this.send.call(this.env, t, "POST")
		}
	}
	return new class {
		constructor(t, e) {
			this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [],
				this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date)
				.getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
		}
		isNode() {
			return "undefined" != typeof module && !!module.exports
		}
		isQuanX() {
			return "undefined" != typeof $task
		}
		isSurge() {
			return "undefined" != typeof $httpClient && "undefined" == typeof $loon
		}
		isLoon() {
			return "undefined" != typeof $loon
		}
		toObj(t, e = null) {
			try {
				return JSON.parse(t)
			} catch {
				return e
			}
		}
		toStr(t, e = null) {
			try {
				return JSON.stringify(t)
			} catch {
				return e
			}
		}
		getjson(t, e) {
			let s = e;
			const i = this.getdata(t);
			if (i) try {
				s = JSON.parse(this.getdata(t))
			} catch {}
			return s
		}
		setjson(t, e) {
			try {
				return this.setdata(JSON.stringify(t), e)
			} catch {
				return !1
			}
		}
		getScript(t) {
			return new Promise(e => {
				this.get({
					url: t
				}, (t, s, i) => e(i))
			})
		}
		runScript(t, e) {
			return new Promise(s => {
				let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
				i = i ? i.replace(/\n/g, "").trim() : i;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
				const [o, h] = i.split("@"), a = {
					url: `http://${h}/v1/scripting/evaluate`,
					body: {
						script_text: t,
						mock_type: "cron",
						timeout: r
					},
					headers: {
						"X-Key": o,
						Accept: "*/*"
					}
				};
				this.post(a, (t, e, i) => s(i))
			}).catch(t => this.logErr(t))
		}
		loaddata() {
			if (!this.isNode()) return {}; {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require(
				"path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e);
				if (!s && !i) return {}; {
					const i = s ? t : e;
					try {
						return JSON.parse(this.fs.readFileSync(i))
					} catch (t) {
						return {}
					}
				}
			}
		}
		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require(
				"path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e),
					r = JSON.stringify(this.data);
				s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
			}
		}
		lodash_get(t, e, s) {
			const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
			let r = t;
			for (const t of i)
				if (r = Object(r)[t], void 0 === r) return s;
			return r
		}
		lodash_set(t, e, s) {
			return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e
				.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i +
					1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
		}
		getdata(t) {
			let e = this.getval(t);
			if (/^@/.test(t)) {
				const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
				if (r) try {
					const t = JSON.parse(r);
					e = t ? this.lodash_get(t, i, "") : e
				} catch (t) {
					e = ""
				}
			}
			return e
		}
		setdata(t, e) {
			let s = !1;
			if (/^@/.test(e)) {
				const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null :
					o || "{}" : "{}";
				try {
					const e = JSON.parse(h);
					this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
				} catch (e) {
					const o = {};
					this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
				}
			} else s = this.setval(t, e);
			return s
		}
		getval(t) {
			return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs
				.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data &&
				this.data[t] || null
		}
		setval(t, e) {
			return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs
				.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this
					.writedata(), !0) : this.data && this.data[e] || null
		}
		initGotEnv(t) {
			this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough :
				require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t &&
				(t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t
					.cookieJar && (t.cookieJar = this.ckjar))
		}
		get(t, e = (() => {})) {
			this.initGotEnv(t);
			const {
				url: s,
				...i
			} = t;
			this.got.get(s, i).then(t => {
				console.log(t);
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => {
				console.log(t);
				const {
					message: s,
					response: i
				} = t;
				e(s, i, i && i.body)
			})
		}
		post(t, e = (() => {})) {
			if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] =
					"application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this
				.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers ||
				{}, Object.assign(t.headers, {
					"X-Surge-Skip-Scripting": !1
				})), $httpClient.post(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			});
			else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object
				.assign(t.opts, {
					hints: !1
				})), $task.fetch(t).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => e(t));
			else if (this.isNode()) {
				this.initGotEnv(t);
				const {
					url: s,
					...i
				} = t;
				this.got.post(s, i).then(t => {
					const {
						statusCode: s,
						statusCode: i,
						headers: r,
						body: o
					} = t;
					e(null, {
						status: s,
						statusCode: i,
						headers: r,
						body: o
					}, o)
				}, t => {
					const {
						message: s,
						response: i
					} = t;
					e(s, i, i && i.body)
				})
			}
		}
		time(t) {
			let e = {
				"M+": (new Date).getMonth() + 1,
				"d+": (new Date).getDate(),
				"H+": (new Date).getHours(),
				"m+": (new Date).getMinutes(),
				"s+": (new Date).getSeconds(),
				"q+": Math.floor(((new Date).getMonth() + 3) / 3),
				S: (new Date).getMilliseconds()
			};
			/(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1
				.length)));
			for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1
				.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
			return t
		}
		msg(e = t, s = "", i = "", r) {
			const o = t => {
				if (!t) return t;
				if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
					"open-url": t
				} : this.isSurge() ? {
					url: t
				} : void 0;
				if ("object" == typeof t) {
					if (this.isLoon()) {
						let e = t.openUrl || t.url || t["open-url"],
							s = t.mediaUrl || t["media-url"];
						return {
							openUrl: e,
							mediaUrl: s
						}
					}
					if (this.isQuanX()) {
						let e = t["open-url"] || t.url || t.openUrl,
							s = t["media-url"] || t.mediaUrl;
						return {
							"open-url": e,
							"media-url": s
						}
					}
					if (this.isSurge()) {
						let e = t.url || t.openUrl || t["open-url"];
						return {
							url: e
						}
					}
				}
			};
			this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this
			.isQuanX() && $notify(e, s, i, o(r)));
			let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
			h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(
				h)
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
		}
		logErr(t, e) {
			const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
			s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("",
				`\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
		}
		wait(t) {
			return new Promise(e => setTimeout(e, t))
		}
		done(t = {}) {
			const e = (new Date).getTime(),
				s = (e - this.startTime) / 1e3;
			this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this
				.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
		}
	}(t, e)
}