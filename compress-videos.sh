#!/bin/bash

# Ищем все MP4 файлы рекурсивно
find . -type f -iname "*.mp4" -print0 | while IFS= read -r -d '' file; do
    # Убираем расширение
    base="${file%.*}"
    output="${base}.webp"

    # Пропускаем, если .webp уже существует
    if [[ -f "$output" ]]; then
        echo "Пропущено (уже существует): $output"
        continue
    fi

    echo "Конвертируем: \"$file\" → \"$output\""

    # Конвертация MP4 в WebP с меньшей частотой кадров и сжатия
    ffmpeg -i "$file" -vcodec libwebp -vf "fps=15,scale=512:-1" -loop 0 -an "$output"

done

echo "✅ Конвертация завершена!"
