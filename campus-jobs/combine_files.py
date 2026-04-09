import os
from pathlib import Path

# Корневая директория проекта
ROOT_DIR = Path(__file__).parent
OUTPUT_FILE = ROOT_DIR / "project_files.txt"

# Директории и файлы для игнорирования
IGNORE_DIRS = {
    "node_modules",
    ".next",
    ".git",
    "dist",
    "build",
    "coverage",
    ".vscode",
    ".idea",
    "prisma/migrations",
}

IGNORE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".DS_Store",
    "project_files.txt",
    "combine_files.py",
    "dev.db",
    "dev.db-journal",
    "tsconfig.tsbuildinfo",
}

# Расширения файлов для включения
INCLUDE_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".css",
    ".md",
    ".prisma",
    ".txt",
}

def should_ignore(path: Path) -> bool:
    """Проверить, нужно ли игнорировать файл или директорию"""
    # Проверить директории в пути
    for part in path.parts:
        if part in IGNORE_DIRS:
            return True
    
    # Проверить имя файла
    if path.name in IGNORE_FILES:
        return True
    
    return False

def should_include_file(path: Path) -> bool:
    """Проверить, нужно ли включать файл по расширению"""
    return path.suffix in INCLUDE_EXTENSIONS

def collect_files(root_dir: Path) -> list[Path]:
    """Собрать все файлы проекта"""
    files = []
    
    for item in root_dir.rglob("*"):
        if item.is_file() and not should_ignore(item) and should_include_file(item):
            files.append(item)
    
    return sorted(files)

def write_file_content(output_file: Path, file_path: Path) -> None:
    """Записать содержимое файла с подписью пути"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        relative_path = file_path.relative_to(ROOT_DIR)
        
        with open(output_file, "a", encoding="utf-8") as f:
            f.write("=" * 80 + "\n")
            f.write(f"FILE: {relative_path}\n")
            f.write("=" * 80 + "\n\n")
            f.write(content)
            f.write("\n\n")
    except Exception as e:
        print(f"Ошибка при чтении файла {file_path}: {e}")

def main():
    # Очистить или создать выходной файл
    if OUTPUT_FILE.exists():
        OUTPUT_FILE.unlink()
    
    print("Сбор файлов проекта...")
    files = collect_files(ROOT_DIR)
    print(f"Найдено {len(files)} файлов")
    
    for file_path in files:
        print(f"Обработка: {file_path.relative_to(ROOT_DIR)}")
        write_file_content(OUTPUT_FILE, file_path)
    
    print(f"\nГотово! Файл создан: {OUTPUT_FILE}")
    print(f"Размер файла: {OUTPUT_FILE.stat().st_size / 1024:.2f} KB")

if __name__ == "__main__":
    main()
