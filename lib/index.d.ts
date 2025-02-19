import React from "react"

export interface WrapperProps {
	source: string
	linkCheckMethod: "redirect" | "fetch"
	failedCheckerLink: string
	children: React.ReactNode

	sourceForCookies?: string
}

export declare const WebViewWrapper: React.FC<WrapperProps>
