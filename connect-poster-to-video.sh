#!/bin/bash

# Массив всех комбинаций видео и соответствующего WebP
declare -a COMMANDS=(
  # carouselData
  "left-half/video1.mp4 outline1.webp"
  "left-half/video2.mp4 outline2.webp"
  "left-half/video3.mp4 outline3.webp"
  "left-half/video4.mp4 outline4.webp"

  "right-half/video1.mp4 outline5.webp"
  "right-half/video2.mp4 outline8.webp"
  "right-half/video3.mp4 outline6.webp"
  "right-half/video4.mp4 outline7.webp"
)

for pair in "${COMMANDS[@]}"; do
  IFS=' ' read -r video outline <<< "$pair"

  input="./src/assets/carousel/about-slider/$video"
  overlay="./src/assets/carousel/about-slider/outlines/$outline"

  output_path="${input%.mp4}-with-outline.mp4"

  echo "Processing $input with $overlay..."
  ffmpeg -i "$input" -i "$overlay" -filter_complex "overlay=0:0" -codec:a copy "$output_path"
done

echo "✅ Готово: все видео с оверлеями созданы."
