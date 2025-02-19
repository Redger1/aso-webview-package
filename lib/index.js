"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebViewWrapper = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_webview_1 = require("react-native-webview");
var cookies_1 = require("@react-native-cookies/cookies");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var LinkCheckMethod;
(function (LinkCheckMethod) {
    LinkCheckMethod[LinkCheckMethod["Redirect"] = 0] = "Redirect";
    LinkCheckMethod[LinkCheckMethod["Fetch"] = 1] = "Fetch";
})(LinkCheckMethod || (LinkCheckMethod = {}));
var jsCode = "\n  window.ReactNativeWebView.postMessage(document.body.innerHTML);\n  ReactNativeWebView.postMessage(document.cookie)\n";
var WebViewWrapper = function (_a) {
    var source = _a.source, linkCheckMethod = _a.linkCheckMethod, failedCheckerLink = _a.failedCheckerLink, sourceForCookies = _a.sourceForCookies, children = _a.children;
    var _b = (0, react_1.useState)(source), webviewSource = _b[0], setWebviewSource = _b[1];
    var _c = (0, react_1.useState)(""), resultLink = _c[0], setResultLink = _c[1];
    var _d = (0, react_1.useState)(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(false), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(""), js = _f[0], setJs = _f[1];
    var setCookies = function (cookies) {
        cookies && async_storage_1.default.setItem("cookies", cookies).catch(function (err) { return console.log(err); });
    };
    (0, react_1.useEffect)(function () {
        if ((resultLink && resultLink.includes("sports.ru")) || !sourceForCookies)
            return;
        var domain = sourceForCookies.replace("https://", "").replace("http://", "");
        async_storage_1.default.getItem("cookies")
            .then(function (res) {
            if (!res)
                return;
            else {
                setJs("document.cookie = \"".concat(res, "\""));
                cookies_1.default.set(sourceForCookies, {
                    name: res.split("=")[0],
                    value: res.split("=")[1],
                    domain: domain,
                    path: "/",
                })
                    .then(function (res) { return console.log(res); })
                    .catch(function (err) { return console.log(err); });
            }
        })
            .catch(function (err) { return console.log(err); });
    }, [resultLink]);
    function onNavChange(event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (event.loading && event.navigationType === "other") {
                    if (event.url.includes("http:"))
                        setWebviewSource(event.url.replace("http:", "https:"));
                    else {
                        if (event.url.includes("sports.ru")) {
                            setResultLink("");
                            setIsLoading(false);
                        }
                        else {
                            setWebviewSource(event.url);
                        }
                    }
                }
                else {
                    setResultLink(event.url);
                    setTimeout(function () {
                        setIsLoading(false);
                    }, 1500);
                }
                getCookies(event);
                return [2 /*return*/];
            });
        });
    }
    function getCookies(event) {
        return __awaiter(this, void 0, void 0, function () {
            var cookies, _a, name, value, newCookie;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cookies_1.default.get(event.url)];
                    case 1:
                        cookies = _b.sent();
                        if (event.url.includes("sign-in") || event.url.includes("log")) {
                            async_storage_1.default.removeItem("cookies");
                            cookies_1.default.clearAll();
                            cookies_1.default.flush();
                            return [2 /*return*/];
                        }
                        if (!event.url.includes("/registration") || !cookies || !cookies["connect.sid"])
                            return [2 /*return*/];
                        _a = cookies["connect.sid"], name = _a.name, value = _a.value;
                        if (name && value) {
                            newCookie = name + "=" + value;
                            setCookies(newCookie);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<>
			{isLoading ? (<>
					<react_native_webview_1.WebView source={{ uri: webviewSource }} style={styles.webviewLoader} javaScriptEnabled injectedJavaScript={jsCode} injectedJavaScriptBeforeContentLoaded={jsCode} onNavigationStateChange={linkCheckMethod == LinkCheckMethod.Redirect ? onNavChange : undefined} onError={function () { return setError(true); }} onMessage={function (event) {
                if (linkCheckMethod == LinkCheckMethod.Redirect)
                    return;
                console.log(event.nativeEvent.data.replaceAll("&amp;", "&"));
                if (typeof event.nativeEvent.data === "string" && event.nativeEvent.data.includes("lb-aff")) {
                    setResultLink(event.nativeEvent.data.replaceAll("&amp;", "&"));
                }
                else {
                    setResultLink("");
                }
                setTimeout(function () {
                    setIsLoading(false);
                }, 1500);
            }}/>
					{!error ? (<react_native_1.View style={styles.loader}>
							<react_native_1.ActivityIndicator color="#000" size="small"/>
						</react_native_1.View>) : null}
				</>) : null}

			{!isLoading ? (resultLink.length > 0 && !resultLink.includes(failedCheckerLink) ? (<react_native_1.SafeAreaView style={{ flex: 1 }}>
						{js ? (<react_native_webview_1.WebView injectedJavaScriptBeforeContentLoaded={js} injectedJavaScript={jsCode} thirdPartyCookiesEnabled sharedCookiesEnabled javaScriptEnabled style={styles.webviewProd} source={{ uri: resultLink }} onNavigationStateChange={getCookies}/>) : (<react_native_webview_1.WebView injectedJavaScript={jsCode} thirdPartyCookiesEnabled sharedCookiesEnabled javaScriptEnabled style={styles.webviewProd} source={{ uri: resultLink }} onNavigationStateChange={getCookies}/>)}
					</react_native_1.SafeAreaView>) : ({ children: children })) : (<react_native_1.View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<react_native_1.ActivityIndicator color="#FFF" size="small"/>
				</react_native_1.View>)}
		</>);
};
exports.WebViewWrapper = WebViewWrapper;
var styles = react_native_1.StyleSheet.create({
    loader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    webviewLoader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0,
    },
    webviewProd: {
        flex: 1,
        width: react_native_1.Dimensions.get("screen").width,
        height: react_native_1.Dimensions.get("screen").height,
    },
});
