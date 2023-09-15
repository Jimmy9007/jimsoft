<?php

declare(strict_types=1);

namespace Usermanager\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Authentication\AuthenticationService;
use Laminas\View\Model\ViewModel;
use Laminas\View\Model\JsonModel;
use Usermanager\Modelo\DAO\PerfilDAO;
use Usermanager\Formularios\EmpleadoclienteForm;
use Usermanager\Modelo\Entidades\Empleadocliente;

class PerfilController extends AbstractActionController
{

    private $DAO;
    private $rutaLog = './public/log/';
    private $rutaArchivos = './public/img/profile/';
    //------------------------------------------------------------------------------

    public function __construct(PerfilDAO $dao)
    {
        $this->DAO = $dao;
    }

    //------------------------------------------------------------------------------

    public function getInfoSesion()
    {
        $infoSesion = [
            'idUsuario ' => 0,
            'idEmpleadoCliente ' => 0,
            'login' => 'SIN INICIO DE SESION',
            'usuario' => 'SIN INICIO DE SESION',
            'foto' => 'perfilHombre.png'
        ];
        $auth = new AuthenticationService();
        if ($auth->hasIdentity()) {
            $infoSesion['idUsuario'] = $auth->getIdentity()->idUsuario;
            $infoSesion['login'] = $auth->getIdentity()->login;
            $infoSesion['idEmpleadoCliente'] = $auth->getIdentity()->idEmpleadoCliente;
            $infoSesion['usuario'] = $auth->getIdentity()->usuario;
            $infoSesion['foto'] = $auth->getIdentity()->foto;
        }
        return $infoSesion;
    }

    //------------------------------------------------------------------------------
    function getFormulario($action = '', $idEmpleado = 0)
    {
        $form = new EmpleadoclienteForm($action);
        if ($idEmpleado != 0) {
            $empleadoOBJ = $this->DAO->getEmpleado($idEmpleado);
            $form->bind($empleadoOBJ);
        }
        return $form;
    }
    //------------------------------------------------------------------------------
    public function indexAction()
    {
        $infosesion = $this->getInfoSesion();
        return new ViewModel([
            'usuario' =>  $infosesion['usuario'],
            'foto' =>  $infosesion['foto'],
        ]);
    }

    //------------------------------------------------------------------------------
    public function cambiarfotoAction()
    {
        $infosesion = $this->getInfoSesion();
        $request = $this->getRequest();
        //----------------------------------------------------------------------
        $files = $request->getFiles()->toArray();
        //----------------------------------------------------------------------
        if (array_key_exists('avatar', $files)) {
            $ext = pathinfo($files['avatar']['name'], PATHINFO_EXTENSION);
            $filesize = new \Laminas\Validator\File\Size([
                'min' => '250B',
                'max' => '500KB',
            ]);
            if (!$filesize->isValid($files['avatar'])) {
                $this->flashMessenger()->addErrorMessage('LA FOTO NO ESTA EN LOS LIMITES PERMITIDOS. <br> MINIMO: 250B  <br> MAXIMO: <b>500KB</b>');
                return new JsonModel(array(
                    'error' => 1,
                ));
            }
            $extensiones = new \Laminas\Validator\File\Extension(array('extension' => array('jpg', 'png', 'gif')));
            if (!$extensiones->isValid($files['avatar'])) {
                $this->flashMessenger()->addErrorMessage('LA EXTENSION DE LA IMAGEN NO ES PERMITIDA. <br> ARCHIVOS PERMITIDOS: <br> jpg, png y gif');
                return new JsonModel(array(
                    'error' => 1,
                ));
            }
            $filter = new \Laminas\Filter\File\RenameUpload([
                'target' => $this->rutaArchivos  . '.' . $ext,
                'randomize' => true,
            ]);
            //----------------------------------------------------------------------
            $upload = $filter->filter($files['avatar']);
            //----------------------------------------------------------------------
            if ($upload['error'] != 0) {
                $this->flashMessenger()->addErrorMessage('NO FUE POSIBLE SUBIR LA FOTO.');
                return new JsonModel(array(
                    'error' => 1,
                ));
            }
            $avatar = basename($upload['tmp_name']);
            //----------------------------------------------------------------------
            try {
                $this->DAO->cambiarFoto($infosesion['idUsuario'], $infosesion['login'], $avatar);
                $this->flashMessenger()->addSuccessMessage('LA FOTO FUE ACTUALIZADA EN JIMSOFT');
            } catch (\Exception $ex) {
                $msgLog = "\n" . date('Y-m-d H:i:s') . " cambiarfotoAction - PerfilController->registrar \n"
                    . $ex->getMessage()
                    . "\n----------------------------------------------------------------------- \n";
                $file = fopen($this->rutaLog . 'jimsoft.log', 'a');
                fwrite($file, $msgLog);
                fclose($file);
                $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! LA FOTO NO  FUE CAMBIADO EN JIMSOFT.');
            }
        }
        return new JsonModel(array(
            'error' => 0,
        ));
    }
    //------------------------------------------------------------------------------
    public function registrarAction()
    {
        $infosesion = $this->getInfoSesion();
        $registradopor = $infosesion['login'];
        //----------------------------------------------------------------------
        $form = new EmpleadoclienteForm('registrar');
        $request = $this->getRequest();
        if (!$request->isPost()) {
            $view = new ViewModel(['form' => $form]);
            $view->setTerminal(true);
            return $view;
        }
        //----------------------------------------------------------------------
        $empleadoOBJ = new Empleadocliente();
        $form->setInputFilter($empleadoOBJ->getInputFilter());
        $form->setData($request->getPost());
        if (!$form->isValid()) {
            /*  print_r($form->getMessages());
            return ['form' => $form]; */
            $this->flashMessenger()->addErrorMessage('LA INFORMACION DE REGISTRO DEL EMPLEADO NO ES VALIDA');
            return $this->redirect()->toUrl('index');
        }
        //----------------------------------------------------------------------
        $empleadoOBJ->exchangeArray($form->getData());
        $empleadoOBJ->setEstado('Activo');
        $empleadoOBJ->setRegistradopor($registradopor);
        $empleadoOBJ->setModificadopor('');
        $empleadoOBJ->setFechahorareg(date('Y-m-d H:i:s'));
        $empleadoOBJ->setFechahoramod('0000-00-00 00:00:00');
        try {
            $this->DAO->registrar($empleadoOBJ);
            $this->flashMessenger()->addSuccessMessage('EL EMPLEADO FUE REGISTRADO EN JIMSOFT');
        } catch (\Exception $ex) {
            $msgLog = "\n" . date('Y-m-d H:i:s') . " REGISTRAR EMPLEADO - EmpleadoclienteController->registrar \n"
                . $ex->getMessage()
                . "\n----------------------------------------------------------------------- \n";
            $file = fopen($this->rutaLog . 'jimsoft.log', 'a');
            fwrite($file, $msgLog);
            fclose($file);
            $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! EL EMPLEADO NO FUE REGISTRADO EN JIMSOFT.');
        }
        return $this->redirect()->toUrl('index');
    }
    //------------------------------------------------------------------------------  
    public function editarAction()
    {
        $idEmpleado = (int) $this->params()->fromQuery('idEmpleado', 0);
        $form = $this->getFormulario('editar', $idEmpleado);
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            if ($form->isValid()) {
                $session = $this->getInfoSesion();
                $empleadoOBJ = new Empleadocliente($form->getData());
                $empleadoOBJ->setModificadopor($session['login']);
                $empleadoOBJ->setFechahoramod(date('Y-m-d H:i:s'));
                try {
                    $this->DAO->editar($empleadoOBJ);
                    $this->flashMessenger()->addSuccessMessage('EL EMPLEADO FUE EDITADO EN JIMSOFT');
                    return $this->redirect()->toUrl('index');
                } catch (\Exception $ex) {
                    $msgLog = "\n" . date('Y-m-d H:i:s') . " EDITAR EMPLEADO - EmpleadoclienteController->registrar \n"
                        . $ex->getMessage()
                        . "\n----------------------------------------------------------------------- \n";
                    $file = fopen($this->rutaLog . 'jimsoft.log', 'a');
                    fwrite($file, $msgLog);
                    fclose($file);
                    $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! <br>EL EMPLEADO NO FUE EDITADO EN JIMSOFT.');
                }
            } else {
                $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE, EL EMPLEADO NO FUE EDITADO EN JIMSOFT');
                return $this->redirect()->toUrl('index');
            }
        }
        $view = new ViewModel([
            'form' => $form,
        ]);
        $view->setTerminal(true);
        return $view;
    }
    //------------------------------------------------------------------------------  
    public function detalleAction()
    {
        $idEmpleado = (int) $this->params()->fromQuery('idEmpleado', 0);
        $infoEmpleado = $this->DAO->getEmpleadoDetalle($idEmpleado);
        $view = new ViewModel(['form' => $infoEmpleado]);
        $view->setTerminal(true);
        return $view;
    }
    //------------------------------------------------------------------------------
    public function eliminarAction()
    {
        $request = $this->getRequest();
        if (!$request->isPost()) {
            $idEmpleadoCliente = (int) $this->params()->fromQuery('idEmpleado', 0);
            $infoCliente = $this->DAO->getEmpleadoDetalle($idEmpleadoCliente);
            $form = new EmpleadoclienteForm('eliminar');
            $form->setData($infoCliente);
            $view = new ViewModel([
                'form' => $form,
            ]);
            $view->setTerminal(true);
            return $view;
        }
        //----------------------------------------------------------------------
        $form = new EmpleadoclienteForm('eliminar');
        $empleadoOBJ = new Empleadocliente();
        $form->setInputFilter($empleadoOBJ->getInputFilter());
        $form->setData($request->getPost());
        if (!$form->isValid()) {
            //print_r($form->getMessages());
            //return ['form' => $form];
            $this->flashMessenger()->addErrorMessage('LA INFORMACION DE ELIMINACION DEL EMPLEADO NO ES VALIDA');
            return $this->redirect()->toUrl('index?idEmpleadoCliente=' . $this->params()->fromPost('idEmpleadoCliente', 0));
        }
        //----------------------------------------------------------------------
        try {
            $empleadoOBJ->exchangeArray($form->getData());
            $infosesion = $this->getInfoSesion();
            $modificadopor = $infosesion['login'];
            $empleadoOBJ->setModificadopor($modificadopor);
            $empleadoOBJ->setFechahoramod(date('Y-m-d H:i:s'));
            $this->DAO->eliminar($empleadoOBJ);
            $this->flashMessenger()->addSuccessMessage('EL EMPLEADO FUE ELIMINADA DE JIMSOFT');
        } catch (\Exception $ex) {
            $msgLog = "\n" . date('Y-m-d H:i:s') . " ELIMINAR EMPLEADO - ContratolaboralController->eliminar \n"
                . $ex->getMessage()
                . "\n----------------------------------------------------------------------- \n";
            $file = fopen($this->rutaLog . 'jimsoft.log', 'a');
            fwrite($file, $msgLog);
            fclose($file);
            $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! <br>EL EMPLEADO NO FUE ELIMINADA DE JIMSOFT.');
        }
        return $this->redirect()->toUrl('index?idEmpleadoCliente=' . $empleadoOBJ->getIdEmpleadoCliente());
    }
    //------------------------------------------------------------------------------  
    public function existeidentificacionAction()
    {
        $error = 0;
        $existe = 1;
        $identificacion = $this->params()->fromQuery('identificacion', '');
        if ($identificacion != '') {
            $existe = $this->DAO->existeIdentificacion($identificacion);
        } else {
            $error = 1;
        }
        return new JsonModel(array(
            'error' => $error,
            'existe' => $existe,
            'identificacion' => $identificacion,
        ));
    }
    //------------------------------------------------------------------------------   
}