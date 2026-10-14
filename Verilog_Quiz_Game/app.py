from flask import Flask, render_template, request, jsonify
import subprocess
import tempfile
import os
from pathlib import Path

app = Flask(__name__)

# Icarus Verilog executables must be available on Windows PATH.
# If they are not, replace these names with full paths to iverilog.exe and vvp.exe.
IVERILOG = "iverilog"
VVP = "vvp"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/simulate", methods=["POST"])
def simulate():
    data = request.get_json(silent=True) or {}
    code = data.get("code", "")
    if not code.strip():
        return jsonify({"ok": False, "output": "Please enter Verilog code first."}), 400

    # Keep the demo safe and simple: compile/run only in a temporary folder.
    # This is intended for a local college project, not public hosting.
    with tempfile.TemporaryDirectory(prefix="verilog_quiz_") as temp_dir:
        source = Path(temp_dir) / "main.v"
        compiled = Path(temp_dir) / "simulation.out"
        source.write_text(code, encoding="utf-8")

        try:
            compile_result = subprocess.run(
                [IVERILOG, "-o", str(compiled), str(source)],
                capture_output=True, text=True, timeout=10
            )
        except FileNotFoundError:
            return jsonify({
                "ok": False,
                "output": "Icarus Verilog command nahi mila. CMD mein 'iverilog -V' check karo, phir Flask terminal ko band karke dobara start karo."
            }), 500
        except subprocess.TimeoutExpired:
            return jsonify({"ok": False, "output": "Compilation timed out."}), 500

        if compile_result.returncode != 0:
            message = (compile_result.stderr or compile_result.stdout or "Compilation failed.").strip()
            return jsonify({"ok": False, "output": message})

        try:
            run_result = subprocess.run(
                [VVP, str(compiled)],
                capture_output=True, text=True, timeout=10
            )
        except FileNotFoundError:
            return jsonify({"ok": False, "output": "vvp command nahi mila. Icarus Verilog installation/PATH check karo."}), 500
        except subprocess.TimeoutExpired:
            return jsonify({"ok": False, "output": "Simulation timed out."}), 500

        output = (run_result.stdout or "").strip()
        errors = (run_result.stderr or "").strip()
        if errors:
            output = (output + "\n" + errors).strip()
        if not output:
            output = "Simulation complete. Display karne ke liye Verilog code mein $display(...) use karo."
        return jsonify({"ok": run_result.returncode == 0, "output": output})

if __name__ == "__main__":
    # Local-only development server.
    app.run(debug=True)
