<?php

declare(strict_types=1);

namespace Usuarios\Controller;

use Laminas\Authentication\Adapter\DbTable\CallbackCheckAdapter as AuthAdapter;
use Laminas\Db\Adapter\Adapter;
use Laminas\Authentication\Result;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\ViewModel;
use Usuarios\Formularios\LoginForm;
use Usuarios\Modelo\DAO\UsuarioDAO;
use Laminas\Authentication\AuthenticationService;
use Laminas\Authentication\Storage\Session as SessionStorage;

class LoginController extends AbstractActionController
{

    private $DAO;
    private $dbAdapter;

    public function __construct(Adapter $adapter, UsuarioDAO $dao)
    {
        $this->dbAdapter = $adapter;
        $this->DAO = $dao;
    }

    public function loginAction()
    {
        $auth = new AuthenticationService();
        if ($auth->hasIdentity()) {
            return $this->redirect()->toRoute('inicio', ['action' => 'index']);
        }
        $formLogin = new LoginForm('IniciarSesion');
        $viewModel = new ViewModel(array('formLogin' => $formLogin));
        $peticion = $this->getRequest();
        if ($peticion->isPost()) {
            $formLogin->setData($peticion->getPost());
            if ($formLogin->isValid()) {
                $datos = $formLogin->getData();
                $authAdapter = new AuthAdapter(
                    $this->dbAdapter,
                    'usuario',
                    'login',
                    'password',
                    function ($hash, $password) {
                        return password_verify($password, $hash);
                    }
                );
                $authAdapter->setIdentity($datos['login'])->setCredential($datos['password']);
                $select = $authAdapter->getDbSelect();
                $select->where("estado = 'Activo'");
                $result = $auth->authenticate($authAdapter);
                switch ($result->getCode()) {
                    case Result::FAILURE_IDENTITY_NOT_FOUND:
                        $this->flashMessenger()->addErrorMessage("USUARIO O CONTRASEÑA INCORRECTO (1)");
                        break;
                    case Result::FAILURE_CREDENTIAL_INVALID:
                        $this->flashMessenger()->addErrorMessage("USUARIO O CONTRASEÑA INCORRECTO (2)");
                        break;
                    case Result::SUCCESS:
                        $storage = $auth->getStorage();
                        $storage->write($authAdapter->getResultRowObject(null, ['password']));
                        //                        $storage = $this->sessionContainer->getStorage();
                        //                        $storage->write($authAdapter->getResultRowObject(null, 'password'));
                        //                        $time = 1209600; // 14 days 1209600/3600 = 336 hours => 336/24 = 14 days
                        ////                        if ($datos['rememberme']) $storage->getSession()->getManager()->rememberMe($time); // no way to get the session
                        //                        if ($datos['recordar']) {
                        //                            $sessionManager = new \Zend\Session\SessionManager();
                        //                            $sessionManager->rememberMe($time);
                        //                        }
                        return $this->redirect()->toRoute('inicio', ['action' => 'index']);
                        //                        break;
                    default:
                        $this->flashMessenger()->addErrorMessage("SE HA PRESENTADO UN INCONVENIENTE CON EL INICIO DE SU SESION (1)");
                        break;
                }
            } else {
                $this->flashMessenger()->addErrorMessage("SE HA PRESENTADO UN INCONVENIENTE CON EL INICIO DE SU SESION (2)");
            }
        }
        $this->layout()->setTemplate('layout/login');
        return $viewModel;
    }

    public function cerrarsesionAction()
    {
        $auth = new AuthenticationService();
        $auth->clearIdentity();
        $this->flashMessenger()->addSuccessMessage("SESIÓN FINALIZADA");
        return $this->redirect()->toUrl('login');
    }
}
