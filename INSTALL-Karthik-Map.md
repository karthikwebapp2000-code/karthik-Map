# Install Karthik Map — the easy way

Karthik Map is one website with apps around it. Pick whichever is easiest for you. All of them need the internet for live data.

## 1. Any phone or computer — no download (easiest)
1. Open the Karthik Map web address you were given.
2. **Android (Chrome / Samsung Internet):** ⋮ menu → **Install app**.
   **iPhone (Safari):** Share → **Add to Home Screen**.
   **Windows / Mac (Chrome or Edge):** click the install icon at the right of the address bar → **Install**.
3. A Karthik Map icon appears. Open it like any app.

## 2. Windows installer (`Karthik-Map-Setup.exe`)
1. Download **Karthik-Map-Setup.exe** from the Releases page.
2. Double-click it. If Windows says *"Windows protected your PC"*, click **More info → Run anyway** (the installer is not code-signed — signing costs money).
3. It installs in a few seconds and puts **Karthik Map** on your desktop and Start menu.
Note: on desktop the *My location* button may not work inside this app (a limitation of desktop apps without a Google key) — use the web version for GPS, or type a place.

## 3. Android app (`Karthik-Map.apk`)
1. Download **Karthik-Map.apk** to your phone.
2. Open it. If asked, allow **Install unknown apps** for your browser/Files app, then tap **Install**.
3. Allow **Location** when the app asks.

## 4. Mac (`Karthik-Map.dmg`) / Linux (`Karthik-Map.AppImage`)
Mac: open the .dmg, drag Karthik Map to Applications; first time, right-click → **Open**. Linux: make the AppImage executable and run it.

## For the owner: making these files
See `.github/workflows/build-installers.yml` — add one variable (`APP_URL`), press **Run workflow**, and GitHub builds the Windows, Android, Mac and Linux files for you. The apps are only wrappers around your deployed website, so update the website and everyone gets the new version.
