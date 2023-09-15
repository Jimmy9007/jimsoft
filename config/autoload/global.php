<?php

/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */
//------------------------------------------------------------------------------
/* $host = '190.90.224.252';
$puerto = '6303'; */
$host = 'localhost';
$puerto = '3603';
$servidor = $host . ':' . $puerto; 
//------------------------------------------------------------------------------
//$host = 'localhost';
//$servidor = $host; 
//------------------------------------------------------------------------------
return [
    'db' => [
        'driver' => 'Pdo',
        'dsn' => "mysql:dbname=jimsoft_bd;host=$servidor;charset=utf8",
    ],
    'session_containers' => [
        Laminas\Session\Container::class,
    ],
    'session_storage' => [
        'type' => Laminas\Session\Storage\SessionArrayStorage::class,
    ],
    'session_config' => [
        'cache_expire' => 60 * 24 * 30,
        'cookie_httponly' => true,
        'cookie_lifetime' => 86400 * 30,
        'gc_maxlifetime' => 86400 * 30,
        'name' => 'JIMSOFT',
        'remember_me_seconds' => 86400 * 30,
        'use_cookies' => true,
    ],
];
