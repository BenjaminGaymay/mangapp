from pyvirtualdisplay import Display


from app.bypass import CloudflareBypasser
from DrissionPage import ChromiumPage, ChromiumOptions
import time

from fastapi import FastAPI

display = Display(visible=0, size=(800, 600))
display.start()

app = FastAPI()

@app.get("/")
def root():
	# Chromium Browser Path
	browser_path = "/usr/bin/chromium"

	options = ChromiumOptions()
	options.set_paths(browser_path=browser_path)

	# Some arguments to make the browser better for automation and less detectable.
	arguments = [
		"-no-first-run",
		"-force-color-profile=srgb",
		"-metrics-recording-only",
		"-password-store=basic",
		"-use-mock-keychain",
		"-export-tagged-pdf",
		"-no-default-browser-check",
		"-disable-background-mode",
		"-enable-features=NetworkService,NetworkServiceInProcess,LoadCryptoTokenExtension,PermuteTLSExtensions",
		"-disable-features=FlashDeprecationWarning,EnablePasswordsAccountStorage",
		"-deny-permission-prompts",
		"-disable-gpu",
		"-accept-lang=en-US",
		'--no-sandbox'
	]

	for argument in arguments:
		options.set_argument(argument)

	driver = ChromiumPage(addr_or_opts=options)

	driver.get('https://www.japscan.lol/lecture-en-ligne/tales-of-demons-and-gods/475/')

	cf_bypasser = CloudflareBypasser(driver)
	cf_bypasser.bypass()

	cookies = driver.cookies()
	agent = driver.user_agent

	driver.quit()

	return {"cookies": cookies, "agent": agent}


display.stop()

