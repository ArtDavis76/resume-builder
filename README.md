# Resume Builder

A small, offline-friendly web app for building a clean, ATS-friendly resume.

The app uses a single-column resume layout with standard headings, a core skills section near the top, reverse-chronological professional experience, concise achievement bullets, local autosave, JSON backup/import, and print-to-PDF support.

## Run Locally

Open `resume-builder-app/index.html` in a browser, or serve it with any static web server.

```powershell
cd resume-builder-app
python -m http.server 5177 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5177/`.

## Windows Installer

The `installer-package` folder contains a no-admin Windows installer. It copies the app into `%LOCALAPPDATA%\ResumeBuilder` and creates a desktop shortcut.

## Notes

- No account is required.
- Resume data is stored locally in the browser.
- The icon library is vendored so the app can run without internet access.
