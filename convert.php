<?php
// Конфигурация
$directory = './src'; // путь к твоим компонентам
$rootFontSize = 16;   // базовый размер шрифта для rem
$mode = 'toRem';      // 'toRem' или 'toPx'

// Рекурсивная функция для обхода файлов
function scanDirRecursively($dir) {
    $files = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile() && preg_match('/\.(js|jsx|ts|tsx|html|css)$/', $file->getFilename())) {
            $files[] = $file->getPathname();
        }
    }
    return $files;
}

// Конвертация px → rem
function pxToRem($content, $rootFontSize) {
    // Находит все числа с px, включая отрицательные и дробные
    return preg_replace_callback('/(-?\d+(\.\d+)?)px/', function($matches) use ($rootFontSize) {
        $pxValue = floatval($matches[1]);
        $remValue = round($pxValue / $rootFontSize, 4);
        return $remValue . 'rem';
    }, $content);
}

// Конвертация rem → px
function remToPx($content, $rootFontSize) {
    // Находит все числа с rem, включая отрицательные и дробные
    return preg_replace_callback('/(-?\d+(\.\d+)?)rem/', function($matches) use ($rootFontSize) {
        $remValue = floatval($matches[1]);
        $pxValue = round($remValue * $rootFontSize, 2);
        return $pxValue . 'px';
    }, $content);
}

// Получаем все файлы
$files = scanDirRecursively($directory);

// Обрабатываем каждый файл
foreach ($files as $file) {
    $content = file_get_contents($file);

    if ($mode === 'toRem') {
        $newContent = pxToRem($content, $rootFontSize);
    } else {
        $newContent = remToPx($content, $rootFontSize);
    }

    if ($newContent !== $content) {
        file_put_contents($file, $newContent);
        echo "Обработан файл: $file\n";
    }
}

echo "Готово! Режим: $mode\n";