# Tweetdeck auto-translator for Google Chrome
author: <a href="https://twitter.com/_YKGM_">`@_YKGM_`</a>

It's α version and operation is not guaranteed. Bugs reports are welcome :)

# Installation
This Chrome extension is an unpackaged and must be installed using developer mode.

- Download the contents of this repository
- Enter `chrome://extensions/` in the address bar
- Turn on the **developer mode** toggle in the upper right
- Click the **Load unpacked** button in the upper left
- Select the downloaded one

# Usage
Right-click on the extension icon and select "option" to open the setting window. Set the languages to be translated and the language to translate to. Tweetdeck needs to be reloaded after changing the extension settings.

Then...

![sample](./readme/sample.gif)

Enjoy!

# Issues
## LanguageApp (GAS) Limit Rates
This extension uses Google Apps Script's LanguageApp to do the translation.
At the moment, I have created an API endpoint with my personal Google account, so if used by many people, it may be trapped by the API's frequency limit.

(I tried to find out the specific limit rate, but it was not clear to me...)

👉After all, I found that there is a API limit (10,000 requests/d?) so I'll consider the API to use...plz wait :(
