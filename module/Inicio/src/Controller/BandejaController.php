<?php

declare(strict_types=1);

namespace Inicio\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Authentication\AuthenticationService;
use Laminas\View\Model\ViewModel;
use Inicio\Modelo\DAO\InicioDAO;

class BandejaController extends AbstractActionController {

    private $DAO;

    public function __construct(InicioDAO $dao) {
        $this->DAO = $dao;
    }

    public function indexAction() {
        $auth = new AuthenticationService();
        if (!$auth->hasIdentity()) {
            return $this->redirect()->toRoute('login');
        }
        return new ViewModel();
    }

}
