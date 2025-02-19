import React, { useEffect, useState } from "react"
import { StyleSheet, View, SafeAreaView, Dimensions, ActivityIndicator } from "react-native"
import { WebView } from "react-native-webview"
import CookieManager from "@react-native-cookies/cookies"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface WrapperProps {
	source: string
	linkCheckMethod: "redirect" | "fetch"
	failedCheckerLink: string
	children: React.ReactNode

	sourceForCookies?: string
}

const jsCode = `
  window.ReactNativeWebView.postMessage(document.body.innerHTML);
  ReactNativeWebView.postMessage(document.cookie)
`

export const WebViewWrapper: React.FC<WrapperProps> = ({
	source,
	linkCheckMethod,
	failedCheckerLink,
	sourceForCookies,
	children,
}) => {
	const [webviewSource, setWebviewSource] = useState<string>(source)
	const [resultLink, setResultLink] = useState<string>("")
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<boolean>(false)
	const [js, setJs] = useState("")

	const setCookies = (cookies: string) => {
		cookies && AsyncStorage.setItem("cookies", cookies).catch(err => console.log(err))
	}

	useEffect(() => {
		if ((resultLink && resultLink.includes("sports.ru")) || !sourceForCookies) return
		const domain = sourceForCookies.replace("https://", "").replace("http://", "")

		AsyncStorage.getItem("cookies")
			.then(res => {
				if (!res) return
				else {
					setJs(`document.cookie = "${res}"`)
					CookieManager.set(sourceForCookies, {
						name: res.split("=")[0],
						value: res.split("=")[1],
						domain: domain,
						path: "/",
					})
						.then(res => console.log(res))
						.catch(err => console.log(err))
				}
			})
			.catch(err => console.log(err))
	}, [resultLink])

	async function onNavChange(event: any) {
		if (event.loading && event.navigationType === "other") {
			if (event.url.includes("http:")) setWebviewSource(event.url.replace("http:", "https:"))
			else {
				if (event.url.includes("sports.ru")) {
					setResultLink("")
					setIsLoading(false)
				} else {
					setWebviewSource(event.url)
				}
			}
		} else {
			setResultLink(event.url)
			setTimeout(() => {
				setIsLoading(false)
			}, 1500)
		}

		getCookies(event)
	}

	async function getCookies(event: any) {
		const cookies = await CookieManager.get(event.url)
		if (event.url.includes("sign-in") || event.url.includes("log")) {
			AsyncStorage.removeItem("cookies")
			CookieManager.clearAll()
			CookieManager.flush()
			return
		}
		if (!event.url.includes("/registration") || !cookies || !cookies["connect.sid"]) return
		const { name, value } = cookies["connect.sid"]
		if (name && value) {
			const newCookie = name + "=" + value
			setCookies(newCookie)
		}
	}

	return (
		<>
			{isLoading ? (
				<>
					<WebView
						source={{ uri: webviewSource }}
						style={styles.webviewLoader}
						javaScriptEnabled
						injectedJavaScript={jsCode}
						injectedJavaScriptBeforeContentLoaded={jsCode}
						onNavigationStateChange={linkCheckMethod == "redirect" ? onNavChange : undefined}
						onError={() => setError(true)}
						onMessage={event => {
							if (linkCheckMethod == "redirect") return

							console.log(event.nativeEvent.data.replaceAll("&amp;", "&"))
							if (typeof event.nativeEvent.data === "string" && event.nativeEvent.data.includes("lb-aff")) {
								setResultLink(event.nativeEvent.data.replaceAll("&amp;", "&"))
							} else {
								setResultLink("")
							}

							setTimeout(() => {
								setIsLoading(false)
							}, 1500)
						}}
					/>
					{!error ? (
						<View style={styles.loader}>
							<ActivityIndicator color="#000" size="small" />
						</View>
					) : null}
				</>
			) : null}

			{!isLoading ? (
				resultLink.length > 0 && !resultLink.includes(failedCheckerLink) ? (
					<SafeAreaView style={{ flex: 1 }}>
						{js ? (
							<WebView
								injectedJavaScriptBeforeContentLoaded={js}
								injectedJavaScript={jsCode}
								thirdPartyCookiesEnabled
								sharedCookiesEnabled
								javaScriptEnabled
								style={styles.webviewProd}
								source={{ uri: resultLink }}
								onNavigationStateChange={getCookies}
							/>
						) : (
							<WebView
								injectedJavaScript={jsCode}
								thirdPartyCookiesEnabled
								sharedCookiesEnabled
								javaScriptEnabled
								style={styles.webviewProd}
								source={{ uri: resultLink }}
								onNavigationStateChange={getCookies}
							/>
						)}
					</SafeAreaView>
				) : (
					{ children }
				)
			) : (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator color="#FFF" size="small" />
				</View>
			)}
		</>
	)
}

const styles = StyleSheet.create({
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
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
	},
})
