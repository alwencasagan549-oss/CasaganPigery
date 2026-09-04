<?php
/**
 * MySQL to PostgreSQL SQL Converter
 * Usage: php scripts/convert-mysql-to-postgres.php <input.sql> <output.sql>
 *
 * This script converts a MySQL dump file to PostgreSQL-compatible SQL
 */

if ($argc !== 3) {
    die("Usage: php scripts/convert-mysql-to-postgres.php <input.sql> <output.sql>\n");
}

$inputFile = $argv[1];
$outputFile = $argv[2];

if (!file_exists($inputFile)) {
    die("Error: Input file not found: $inputFile\n");
}

$content = file_get_contents($inputFile);

// Remove MySQL-specific comments and commands
$content = preg_replace('/--.*$/m', '', $content);
$content = preg_replace('/\/\*![0-9]+.*?\*\/;/s', '', $content);
$content = preg_replace('/SET (NAMES|SQL_MODE|FOREIGN_KEY_CHECKS|UNIQUE_CHECKS|TIME_ZONE|CHARACTER SET|COLLATION).*?;/i', '', $content);
$content = preg_replace('/LOCK TABLES.*?UNLOCK TABLES;/is', '', $content);
$content = preg_replace('/DROP TABLE IF EXISTS.*?;/i', 'DROP TABLE IF EXISTS $1 CASCADE;', $content);
$content = preg_replace('/CREATE DATABASE.*?;/i', '', $content);
$content = preg_replace('/USE .*?;/i', '', $content);

// Convert backtick quoting to double quotes
$content = str_replace('`', '"', $content);

// Convert AUTO_INCREMENT to SERIAL
$content = preg_replace('/INT\s+NOT\s+NULL\s+AUTO_INCREMENT/SERIAL/', 'SERIAL PRIMARY KEY', $content);

// Convert TINYINT to SMALLINT
$content = preg_replace('/TINYINT\((\d+)\)/', 'SMALLINT', $content);

// Convert TINYINT(1) to BOOLEAN
$content = preg_replace('/TINYINT\(1\)\s+NOT\s+NULL\s+DEFAULT\s+[\'"]0[\'"]/i', 'BOOLEAN NOT NULL DEFAULT false', $content);
$content = preg_replace('/TINYINT\(1\)\s+NOT\s+NULL\s+DEFAULT\s+[\'"]1[\'"]/i', 'BOOLEAN NOT NULL DEFAULT true', $content);

// Convert UNSIGNED (remove it, PostgreSQL doesn't use it)
$content = preg_replace('/\s+UNSIGNED/i', '', $content);

// Convert DEFAULT '0000-00-00' to DEFAULT NULL for dates
$content = preg_replace("/DEFAULT\s+'0000-00-00'/i", 'DEFAULT NULL', $content);

// Convert ENGINE and CHARSET to empty
$content = preg_replace('/\s+ENGINE\s*=\s*\w+/i', '', $content);
$content = preg_replace('/\s+DEFAULT\s+CHARSET\s*=\s*\w+/i', '', $content);
$content = preg_replace('/\s+COLLATE\s*=\s*\w+/i', '', $content);

// Clean up multiple spaces
$content = preg_replace('/\s+/', ' ', $content);

// Add CASCADE to foreign keys if missing
$content = preg_replace('/REFERENCES\s+\("?\w+"?\)\s*\(/', 'REFERENCES \1 CASCADE (', $content);

file_put_contents($outputFile, $content);
echo "Conversion complete! Output: $outputFile\n";
