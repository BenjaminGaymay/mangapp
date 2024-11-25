from app.bypass import CloudflareBypasser
from DrissionPage import ChromiumPage, ChromiumOptions
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict

from pyvirtualdisplay import Display


# Pydantic model for the response
class CookieResponse(BaseModel):
    cookies: Dict[str, str]
    agent: str


# Chromium Browser Path
browser_path = "/usr/bin/chromium"

app = FastAPI()
display = Display(visible=False, size=(1920, 1080))
display.start()


@app.get("/", response_model=CookieResponse)
def root():
    # Start Xvfb for Docker

    options = ChromiumOptions()
    options.set_argument("--auto-open-devtools-for-tabs", "true")
    options.set_argument("--remote-debugging-port=9222")
    options.set_argument("--no-sandbox")  # Necessary for Docker
    options.set_argument("--disable-gpu")  # Optional, helps in some cases
    options.set_paths(browser_path=browser_path).headless(False)

    driver = ChromiumPage(addr_or_opts=options)

    try:
        driver.get(
            "https://www.japscan.lol/lecture-en-ligne/tales-of-demons-and-gods/475/"
        )
        cf_bypasser = CloudflareBypasser(driver, 5, True)
        cf_bypasser.bypass()
        cookies = driver.cookies(as_dict=True)
        agent = driver.user_agent

        return {"cookies": cookies, "agent": agent}
    except Exception as e:
        raise e
    finally:
        driver.quit()


display.stop()
