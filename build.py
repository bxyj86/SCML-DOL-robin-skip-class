# -*- coding: utf-8 -*-
"""
打包脚本：把模组目录压成可发布的 zip

用法：
    python3 build.py

输出：
    上层目录的 带罗宾逃课.zip

打包内容（只这四个）：
    - twee/
    - boot.json
    - framework.js
    - README.md
"""
import zipfile, os, json

SRC = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(os.path.dirname(SRC), "带罗宾逃课.zip")
MOD_NAME = "带罗宾逃课"

# 明确列出要打包的内容
INCLUDE_FILES = {"boot.json", "framework.js", "README.md"}
INCLUDE_DIRS = {"twee"}

def build():
    if os.path.exists(DST):
        os.remove(DST)
    count = 0
    with zipfile.ZipFile(DST, "w", zipfile.ZIP_DEFLATED) as z:
        # 打包顶级文件
        for name in sorted(INCLUDE_FILES):
            full = os.path.join(SRC, name)
            if os.path.isfile(full):
                z.write(full, os.path.join(MOD_NAME, name))
                count += 1
            else:
                print("⚠️  缺少文件:", name)
        # 打包目录
        for dirname in sorted(INCLUDE_DIRS):
            dirpath = os.path.join(SRC, dirname)
            if not os.path.isdir(dirpath):
                print("⚠️  缺少目录:", dirname)
                continue
            for dp, dns, fns in os.walk(dirpath):
                for f in sorted(fns):
                    if f.endswith(".zip"): continue
                    full = os.path.join(dp, f)
                    rel = os.path.relpath(full, SRC)
                    z.write(full, os.path.join(MOD_NAME, rel))
                    count += 1
    size = os.path.getsize(DST)
    print("✓ 打包完成")
    print("  文件数:", count)
    print("  大小:", size, "bytes")
    print("  输出:", DST)
    print()
    print("包内结构：")
    with zipfile.ZipFile(DST) as z:
        for n in z.namelist():
            print("  " + n)

if __name__ == "__main__":
    build()
