<?php
$src = imagecreatefrompng('public/assets/logo.png');
$w = imagesx($src);
$h = imagesy($src);

// Generate 192x192
$size1 = 192;
$dst1 = imagecreatetruecolor($size1, $size1);
imagealphablending($dst1, false);
imagesavealpha($dst1, true);
$transparent = imagecolorallocatealpha($dst1, 255, 255, 255, 127);
imagefilledrectangle($dst1, 0, 0, $size1, $size1, $transparent);
imagecopyresampled($dst1, $src, 0, 0, 0, 0, $size1, $size1, $w, $h);
imagepng($dst1, 'public/assets/logo-192x192.png');

// Generate 512x512
$size2 = 512;
$dst2 = imagecreatetruecolor($size2, $size2);
imagealphablending($dst2, false);
imagesavealpha($dst2, true);
$transparent = imagecolorallocatealpha($dst2, 255, 255, 255, 127);
imagefilledrectangle($dst2, 0, 0, $size2, $size2, $transparent);
imagecopyresampled($dst2, $src, 0, 0, 0, 0, $size2, $size2, $w, $h);
imagepng($dst2, 'public/assets/logo-512x512.png');

echo "Done\n";
