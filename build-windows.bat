@echo off
REM ============================================================
REM  Sports Window - build the Windows installer yourself
REM ============================================================
REM  Double-click this file. It checks for the two tools needed
REM  (Node.js and Rust), installs them for you if they're missing,
REM  then builds the Windows installer. When it finishes, it opens
REM  the folder containing "Sports Window_..._x64-setup.exe" - run
REM  that to install the app.
REM
REM  Most people do NOT need this: the ready-made installer is on
REM  the Releases page. Use this only if you'd rather build from
REM  source.
REM ============================================================

setlocal
cd /d "%~dp0"
echo.
echo ===== Sports Window: Windows build helper =====
echo.

REM --- Check for winget (used to auto-install missing tools) ---
where winget >nul 2>&1
if errorlevel 1 (
  set "HAVE_WINGET=0"
) else (
  set "HAVE_WINGET=1"
)

REM --- Node.js -------------------------------------------------
where npm >nul 2>&1
if errorlevel 1 (
  echo [1/3] Node.js not found.
  if "%HAVE_WINGET%"=="1" (
    echo       Installing Node.js LTS...
    winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
  ) else (
    echo       Please install Node.js 20+ from https://nodejs.org/ and run this again.
    goto :fail
  )
) else (
  echo [1/3] Node.js found.
)

REM --- Rust ----------------------------------------------------
where cargo >nul 2>&1
if errorlevel 1 (
  echo [2/3] Rust not found.
  if "%HAVE_WINGET%"=="1" (
    echo       Installing Rust...
    winget install -e --id Rustlang.Rustup --accept-source-agreements --accept-package-agreements
    echo       NOTE: Rust may need the "Visual Studio Build Tools" with the
    echo       "Desktop development with C++" workload to compile. If the build
    echo       below fails mentioning a linker or "link.exe", install it with:
    echo           winget install -e --id Microsoft.VisualStudio.2022.BuildTools
    echo       and pick the "Desktop development with C++" workload, then re-run.
  ) else (
    echo       Please install Rust from https://www.rust-lang.org/tools/install and run this again.
    goto :fail
  )
) else (
  echo [2/3] Rust found.
)

REM --- Build ---------------------------------------------------
echo [3/3] Installing dependencies and building (this takes a few minutes)...
call npm install
if errorlevel 1 goto :fail
call npx tauri build
if errorlevel 1 goto :fail

echo.
echo ===== Done! =====
echo Opening the folder with your installer...
start "" "%~dp0src-tauri\target\release\bundle\nsis"
echo Run the "Sports Window_..._x64-setup.exe" file in that folder to install.
echo.
pause
exit /b 0

:fail
echo.
echo Build did not finish. See the messages above for what went wrong.
echo.
pause
exit /b 1
