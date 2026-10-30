@echo off
rem Builds and runs drills.cpp with the Visual Studio C++ compiler.
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
for /f "usebackq delims=" %%i in (`call "%%VSWHERE%%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "VSDIR=%%i"
if not defined VSDIR (echo Visual Studio C++ tools not found. Install "Desktop development with C++". & exit /b 1)
call "%VSDIR%\VC\Auxiliary\Build\vcvars64.bat" >nul 2>nul
pushd "%~dp0"
cl /nologo /EHsc /std:c++17 /W4 drills.cpp && .\drills.exe
del /q drills.obj 2>nul
popd
