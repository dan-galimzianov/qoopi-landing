#!/bin/bash

# Ищем PNG и JPEG файлы, даже если в имени есть пробелы
find . -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 | while IFS= read -r -d '' file; do
    # Убираем расширение
    base="${file%.*}"
    output="${base}.webp"

    # Пропускаем, если .webp уже существует
    if [[ -f "$output" ]]; then
        echo "Пропущено (уже существует): $output"
        continue
    fi

    echo "Конвертируем: \"$file\" → \"$output\""

    # Конвертация с правильными параметрами
    ffmpeg -i "$file" -vcodec libwebp -q:v 80 -loop 0 -an "$output"

done

echo "✅ Конвертация завершена!"
