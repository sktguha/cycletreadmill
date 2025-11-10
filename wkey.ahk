#NoTrayIcon
; Usage:
;   wkey.exe down
;   wkey.exe up
; If you double-click (no args), it will just do nothing safely.

arg := (A_Args.Length >= 1) ? A_Args[1] : ""
arg := StrLower(arg)

if (arg = "down")
    Send("{w down}")
else if (arg = "up")
    Send("{w up}")
; otherwise, do nothing

ExitApp
