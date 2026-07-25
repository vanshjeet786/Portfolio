import subprocess
import sys

def run_command(command):
    print(f"Running: {command}")
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = process.communicate()
    if process.returncode != 0:
        print(f"Error running {command}:\n{err.decode('utf-8')}")
        sys.exit(1)
    print(out.decode('utf-8'))

run_command("npm run build")
run_command("npx tsc --noEmit")
