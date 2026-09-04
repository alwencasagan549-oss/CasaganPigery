<?php
/**
 * InfinityFree Deployment Package Generator
 * Creates a single ZIP file ready to upload to InfinityFree File Manager.
 *
 * Usage: php deploy.php
 *
 * Steps:
 *   1. Run this script from your project root
 *   2. Upload deploy/casagan-pigery-deploy.zip to InfinityFree via File Manager
 *   3. Extract in /htdocs/ on InfinityFree
 */

$projectRoot = __DIR__;
$distDir = $projectRoot . '/deploy';
$zipFile = $distDir . '/casagan-pigery-deploy.zip';

// Clean previous build
if (file_exists($distDir)) {
    array_map('unlink', glob("$distDir/*"));
    rmdir($distDir);
}
mkdir($distDir, 0755, true);

// Step 1: Build frontend assets with correct domain
echo "Building frontend assets...\n";
chdir($projectRoot);
passthru('npm run build 2>&1', $buildResult);
if ($buildResult !== 0) {
    die("Build failed!\n");
}

echo "Creating deployment package...\n";

// Step 2: Create ZIP from public/ folder (InfinityFree htdocs structure)
$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Cannot create zip file\n");
}

$publicDir = $projectRoot . '/public';
$addDir = function ($dir, $base = '') use ($zip, $publicDir) {
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($files as $file) {
        $path = $file->getRealPath();
        $relativePath = $base . '/' . $file->getFilename();
        $zip->addFile($path, $relativePath);
    }
    $subDirs = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    foreach ($subDirs as $dirItem) {
        if ($dirItem->isDir()) {
            $dirRelativePath = $base . '/' . $dirItem->getFilename();
            $zip->addEmptyDir($dirRelativePath);
        }
    }
};

$addDir($publicDir);

// Step 3: Add essential Laravel files outside public/
$essentialDirs = ['app', 'bootstrap', 'config', 'database', 'resources', 'routes', 'storage/framework', 'storage/logs', 'vendor'];
$ignoreDirs = ['node_modules', 'build', 'assets', 'tests', '.git'];

foreach ($essentialDirs as $dir) {
    $fullPath = $projectRoot . '/' . $dir;
    if (file_exists($fullPath)) {
        $zip->addEmptyDir($dir);
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($fullPath, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );
        foreach ($files as $file) {
            $path = $file->getRealPath();
            $relativePath = $dir . '/' . $file->getFilename();
            $zip->addFile($path, $relativePath);
        }
    }
}

$essentialFiles = ['.env', '.htaccess', 'artisan', 'composer.json', 'composer.lock'];
foreach ($essentialFiles as $file) {
    $fullPath = $projectRoot . '/' . $file;
    if (file_exists($fullPath)) {
        $zip->addFile($fullPath, $file);
    }
}

$zip->close();

echo "Done! Upload deploy/casagan-pigery-deploy.zip to InfinityFree.\n";
echo "File size: " . round(filesize($zipFile) / 1024 / 1024, 2) . " MB\n";
