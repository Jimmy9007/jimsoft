<?php

namespace Usuarios;

use Laminas\Router\Http\Segment;

return [
    // The following section is new and should be added to your file:
    'router' => [
        'routes' => [
            'login' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/login',
                    'defaults' => [
                        'controller' => Controller\LoginController::class,
                        'action' => 'login',
                    ],
                ],
            ],
            'cerrarsesion' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/cerrarsesion',
                    'defaults' => [
                        'controller' => Controller\LoginController::class,
                        'action' => 'cerrarsesion',
                    ],
                ],
            ],
            'usuarios' => [
                // First we define the basic options for the parent route:
                'type' => \Laminas\Router\Http\Literal::class,
                'options' => [
                    'route' => '/usuarios',
                    'defaults' => [
                        'controller' => Controller\LoginController::class,
                        'action' => 'index',
                    ],
                ],
                // The following allows "/news" to match on its own if no child
                // routes match:
                'may_terminate' => true,
                // Child routes begin:
                'child_routes' => [
                    'archive' => [
                        'type' => \Laminas\Router\Http\Segment::class,
                        'options' => [
                            'route' => '/:controller/:action[/:id1]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'id1' => '[a-zA-Z0-9_-]*',
                            ),
                            'defaults' => [],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            'usuarios' => __DIR__ . '/../view',
        ],
    ],
];
