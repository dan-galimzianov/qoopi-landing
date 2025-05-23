#!/bin/bash

# Рекурсивный поиск всех .mp4 файлов
find . -type f -name "*.mp4" | while read -r video; do
    # Получаем путь к директории и имя файла без расширения
    dir=$(dirname "$video")
    filename=$(basename "$video" .mp4)
    
    # Формируем имя постера
    output="$dir/${filename}-poster.webp"
    
    echo "Создание постера для: $video -> $output"
    
    # Извлечение первого кадра с помощью ffmpeg
    ffmpeg -y -i "$video" -vf "select=eq(n\,0)" -frames:v 1 -c:v libwebp -q:v 70 -loop 0 -an "$output"
done
