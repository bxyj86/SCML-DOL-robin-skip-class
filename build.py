# -*- coding: utf-8 -*-
"""
打包脚本：把模组目录压成可发布的 zip

用法：
    python3 build.py

输出：
    同目录下的 带罗宾逃课.zip

排除：
    - README.md / LICENSE / CHANGELOG.md
    - .gitignore / .git/
    - 已存在的 zip
    - build.py 自身
"""
import zipfile, os

SRC = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(os.path.dirname(SRC), "带罗宾逃课.zip")
MOD_NAME = "带罗宾逃课"

EXCLUDE_FILES = {
    "README.md", "LICENSE", "CHANGELOG.md",
    ".gitignore", "build.py",
}
EXCLUDE_DIRS = {".git", ".vscode", ".idea", "__pycache__"}

def should_skip_file(name):
    if name in EXCLUDE_FILES: return True
    if name.endswith(".zip") or name.endswith(".pyc"): return True
    return False

def should_skip_dir(name):
    return name in EXCLUDE_DIRS

def build():
    count = 0
    if os.path.exists(DST):
        os.remove(DST)
    with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as z:
        for dp, dns, fns in os.walk(SRC):
            dns[:] = [d for d in dns if not should_skip_dir(d)]
            for f in sorted(fns):
                if should_skip_file(f): continue
                full = os.path.join(dp, f)
                rel = os.path.relpath(full, SRC)
                arc = os.path.join(MOD_NAME, rel)
                z.write(full, arc)
                count += 1
    size = os.path.getsize(DST)
    print("✓ 打包完成")
    print("  文件数:", count)
    print("  大小:", size, "bytes")
    print("  输出:", DST)

if __name__ == "__main__":
    build()
