@echo off
cd..
cd..
cd src/app
if not exist "dialogs" mkdir "dialogs"
cd dialogs
echo Enter Dialog-Component Name here
echo Should start with a capital letter and not contain dialog
set /p componentname="(e.g. AnyTest): "
for /f "usebackq delims=" %%I in (`powershell "\"%componentname%\".toLower()"`) do set "lower=%%~I"
if not exist %lower% mkdir %lower%
cd %lower%
set fileprefix=%lower%-dialog

echo Generating file 1/3
echo.>%fileprefix%.html
echo Done
echo Generating file 2/3
echo.>%fileprefix%.scss
echo Done

echo Generating file 3/3
echo import { Component, Inject } from '@angular/core';> %fileprefix%.ts
echo import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';>> %fileprefix%.ts
echo.>>%fileprefix%.ts
echo @Component({>> %fileprefix%.ts
echo     templateUrl: './%fileprefix%.html',>> %fileprefix%.ts
echo     styleUrls: ['./%fileprefix%.scss']>> %fileprefix%.ts
echo })>> %fileprefix%.ts
echo export class %componentname%Dialog {>> %fileprefix%.ts
echo.>> %fileprefix%.ts
echo     options: Array^<String^>;>> %fileprefix%.ts
echo     constructor(public dialogRef: MatDialogRef^<%componentname%Dialog^>, @Inject(MAT_DIALOG_DATA) public data: Array^<String^>) {>> %fileprefix%.ts
echo         this.options = data;>> %fileprefix%.ts
echo     }>> %fileprefix%.ts
echo.>> %fileprefix%.ts
echo     closeDialog(): void {>> %fileprefix%.ts
echo         this.dialogRef.close();>> %fileprefix%.ts
echo     }>> %fileprefix%.ts
echo }>> %fileprefix%.ts
echo Done
cd..
cd..
cd..
cd..
cd cli/windows

echo Successfully generated Component
echo Simply add %componentname% to the dialog-components.ts to use it
echo Press any key...
pause >nul