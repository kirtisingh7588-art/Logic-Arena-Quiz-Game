LOGIC ARENA - Icarus Verilog Quiz Game
======================================

Is project mein:
- Dark gaming style quiz website
- Digital Logic aur Verilog ke 8 MCQ questions
- Timer, score, XP, accuracy aur restart
- Verilog Lab: website se local Icarus Verilog compile/run
- Quick Guide

IMPORTANT:
Icarus Verilog pehle se installed hona chahiye aur CMD mein `iverilog -V` chalna chahiye.
Ye local college demo ke liye hai. Public internet par code-execution server deploy mat karna.

WINDOWS + VS CODE SETUP
-----------------------
1. ZIP extract karo.
2. VS Code > File > Open Folder > extracted `Verilog_Quiz_Game` folder select karo.
3. VS Code > Terminal > New Terminal.
4. Check: `python --version`
5. Install Flask:
   `py -m pip install -r requirements.txt`
   Agar `py` command nahi chale, try `python -m pip install -r requirements.txt`.
6. Run:
   `py app.py`
   Agar `py` na chale, try `python app.py`.
7. Terminal mein local address dikhega, aam taur par:
   http://127.0.0.1:5000
8. Ctrl+click the address in VS Code terminal, or copy it into Chrome.
9. Website open rehne ke liye terminal band mat karna. Stop server: terminal mein Ctrl+C.

FOLDER STRUCTURE
----------------
Verilog_Quiz_Game/
  app.py
  requirements.txt
  README_HINGLISH.txt
  templates/
    index.html
  static/
    style.css
    script.js

HOW TO TEST THE VERILOG LAB
---------------------------
1. Website open karo.
2. Left menu mein Verilog Lab click karo.
3. Sample code already editor mein hai.
4. Run simulation click karo.
5. Output mein AND gate ki truth table aani chahiye.

IF `iverilog` IS NOT RECOGNIZED
-------------------------------
- Check that the `bin` folder of Icarus Verilog is added to Windows User PATH.
- After changing PATH, close VS Code completely and open it again.
- In the VS Code terminal run `iverilog -V` and `vvp -V`.
- If Icarus is installed in a custom folder and PATH is still not working, edit `app.py` and set IVERILOG and VVP to their full executable paths, for example:
  IVERILOG = r"C:\iverilog\bin\iverilog.exe"
  VVP = r"C:\iverilog\bin\vvp.exe"
  Use your actual folder path.

TROUBLESHOOTING
---------------
- `No module named flask`: run `py -m pip install -r requirements.txt`.
- Browser cannot connect: ensure `py app.py` is still running.
- Simulation error: read the output box; check Verilog syntax and `$display`.
- Website fonts may use a fallback if internet is unavailable.

COLLEGE PROJECT EXPLANATION
---------------------------
Frontend: HTML, CSS, JavaScript
Backend: Python Flask
Verilog toolchain: Icarus Verilog (`iverilog`) compiles code and `vvp` runs simulation.
The quiz itself is browser-based; the Verilog Lab demonstrates the live simulator integration.
