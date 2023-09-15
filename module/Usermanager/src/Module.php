<?php

namespace Usermanager;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;

class Module implements ConfigProviderInterface
{

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function getServiceConfig()
    {
        return [
            'factories' => [
                Modelo\DAO\EmpleadoclienteDAO::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    return new Modelo\DAO\EmpleadoclienteDAO($dbAdapter);
                },
                //--------------------------------------------------------------
                Modelo\DAO\AccesoDAO::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    return new Modelo\DAO\AccesoDAO($dbAdapter);
                },
                //--------------------------------------------------------------
                Modelo\DAO\PerfilDAO::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    return new Modelo\DAO\PerfilDAO($dbAdapter);
                },
            ],
        ];
    }

    public function getControllerConfig()
    {
        return [
            'factories' => [
                Controller\EmpleadoclienteController::class => function ($container) {
                    return new Controller\EmpleadoclienteController($container->get(Modelo\DAO\EmpleadoclienteDAO::class));
                },
                Controller\AccesoController::class => function ($container) {
                    return new Controller\AccesoController($container->get(Modelo\DAO\AccesoDAO::class));
                },
                Controller\PerfilController::class => function ($container) {
                    return new Controller\PerfilController($container->get(Modelo\DAO\PerfilDAO::class));
                },
            ],
        ];
    }
}
