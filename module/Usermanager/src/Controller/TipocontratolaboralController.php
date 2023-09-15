<?php

declare(strict_types=1);

namespace Talentohumano\Controller;

use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\Authentication\AuthenticationService;
use Laminas\View\Model\ViewModel;
use Laminas\View\Model\JsonModel;
use Talentohumano\Modelo\DAO\TipocontratolaboralDAO;
use Talentohumano\Formularios\TipocontratolaboralForm;
use Talentohumano\Modelo\Entidades\Tipocontratolaboral;

class TipocontratolaboralController extends AbstractActionController
{

    private $DAO;
    private $rutaLog = './public/log/';
    private $rutaArchivos = './public/archivos/TCL/';


    //------------------------------------------------------------------------------

    public function __construct(TipocontratolaboralDAO $dao)
    {
        $this->DAO = $dao;
    }

    //------------------------------------------------------------------------------

    public function getInfoSesion()
    {
        $infoSesion = [
            'idEmpleado' => 0,
            'login' => 'SIN INICIO DE SESION'
        ];
        $auth = new AuthenticationService();
        if ($auth->hasIdentity()) {
            $infoSesion['login'] = $auth->getIdentity()->login;
            $infoSesion['idEmpleado'] = $auth->getIdentity()->idEmpleado;
        }
        return $infoSesion;
    }

    //------------------------------------------------------------------------------
    function getFormulario($action = '', $idTipoContratoLaboral = 0)
    {
        $form = new TipocontratolaboralForm($action);
        if ($action == 'editar') {
            $form->get('plantilla')->setAttribute('readonly', true);
            $form->get('plantilla')->setAttribute('required', false);
            $form->get('plantilla')->setAttribute('type', 'text');
        }
        if ($idTipoContratoLaboral != 0) {
            $tclOBJ = $this->DAO->getTCL($idTipoContratoLaboral);
            $form->bind($tclOBJ);
        }
        return $form;
    }
    //------------------------------------------------------------------------------

    public function indexAction()
    {
        $filtro = " tipo_contrato_laboral.estado != 'Eliminado'";
        return new ViewModel([
            'tcls' => $this->DAO->getTCLs($filtro)
        ]);
    }

    //------------------------------------------------------------------------------

    public function registrarAction()
    {
        $infosesion = $this->getInfoSesion();
        $registradopor = $infosesion['login'];
        //----------------------------------------------------------------------
        $form = new TipocontratolaboralForm('registrar');
        $request = $this->getRequest();
        if (!$request->isPost()) {
            $view = new ViewModel(['form' => $form]);
            $view->setTerminal(true);
            return $view;
        }
        //----------------------------------------------------------------------
        $tclOBJ = new Tipocontratolaboral();
        $form->setInputFilter($tclOBJ->getInputFilter());
        $form->setData($request->getPost());
        if (!$form->isValid()) {
            /*  print_r($form->getMessages());
            return ['form' => $form]; */
            $this->flashMessenger()->addErrorMessage('LA INFORMACION DE REGISTRO DEL TCL NO ES VALIDA');
            return $this->redirect()->toUrl('index');
        }
        //----------------------------------------------------------------------
        $files = $request->getFiles()->toArray();
        //----------------------------------------------------------------------
        $uploadOK = new \Laminas\Validator\File\UploadFile();
        if (!$uploadOK->isValid($files['plantilla'])) {
            $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO PRESENTA ERRORES AL CARGAR AL SERVIDOR');
            return $this->redirect()->toUrl('index');
        }
        if (array_key_exists('plantilla', $files)) {
            $ext = pathinfo($files['plantilla']['name'], PATHINFO_EXTENSION);
            $filesize = new \Laminas\Validator\File\Size([
                'min' => '250B',
                'max' => '2MB',
            ]);
            if (!$filesize->isValid($files['plantilla'])) {
                $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO NO ESTA EN LOS LIMITES PERMITIDOS. <br> MINIMO: 250B  <br> MAXIMO: <b>2MB</b>');
                return $this->redirect()->toUrl('index');
            }
            $extensiones = new \Laminas\Validator\File\Extension(array('extension' => array('txt')));
            if (!$extensiones->isValid($files['plantilla'])) {
                $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO NO ES PERMITIDO. <br> ARCHIVOS PERMITIDOS: <br> txt');
                return $this->redirect()->toUrl('index');
            }
            $filter = new \Laminas\Filter\File\RenameUpload([
                'target' => $this->rutaArchivos . 'TCL' . '.' . $ext,
                'randomize' => true,
            ]);
            //----------------------------------------------------------------------
            $upload = $filter->filter($files['plantilla']);
            //----------------------------------------------------------------------
            if ($upload['error'] != 0) {
                $this->flashMessenger()->addErrorMessage('NO FUE POSIBLE SUBIR EL ARCHIVO DE RESPALDO ADJUNTO.');
                return $this->redirect()->toUrl('index');
            }
            $respaldo = basename($upload['tmp_name']);
            //----------------------------------------------------------------------
        }
        $tclOBJ->exchangeArray($form->getData());
        $tclOBJ->setPlantilla($respaldo);
        $tclOBJ->setEstado('Registrado');
        $tclOBJ->setRegistradopor($registradopor);
        $tclOBJ->setModificadopor('');
        $tclOBJ->setFechahorareg(date('Y-m-d H:i:s'));
        $tclOBJ->setFechahoramod('0000-00-00 00:00:00');
        try {
            $this->DAO->registrar($tclOBJ);
            $this->flashMessenger()->addSuccessMessage('EL TCL FUE REGISTRADO EN JOSANDRO');
        } catch (\Exception $ex) {
            $msgLog = "\n" . date('Y-m-d H:i:s') . " REGISTRAR TCL - TipocontratolaboralController->registrar \n"
                . $ex->getMessage()
                . "\n----------------------------------------------------------------------- \n";
            $file = fopen($this->rutaLog . 'josandro.log', 'a');
            fwrite($file, $msgLog);
            fclose($file);
            $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! EL TCL NO FUE REGISTRADO EN JOSANDRO.');
        }

        return $this->redirect()->toUrl('index');
    }

    //------------------------------------------------------------------------------  
    public function editarAction()
    {
        $idTipoContratoLaboral = (int) $this->params()->fromQuery('idTipoContratoLaboral', 0);
        $form = $this->getFormulario('editar', $idTipoContratoLaboral);
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            if ($form->isValid()) {
                $session = $this->getInfoSesion();
                $tclOBJ = new Tipocontratolaboral($form->getData());
                $tclOBJ->setModificadopor($session['login']);
                $tclOBJ->setFechahoramod(date('Y-m-d H:i:s'));
                try {
                    $this->DAO->editar($tclOBJ);
                    $this->flashMessenger()->addSuccessMessage('EL TCL FUE EDITADO EN JOSANDRO');
                    return $this->redirect()->toUrl('index');
                } catch (\Exception $ex) {
                    $msgLog = "\n" . date('Y-m-d H:i:s') . " EDITAR TCL - EmpleadoController->registrar \n"
                        . $ex->getMessage()
                        . "\n----------------------------------------------------------------------- \n";
                    $file = fopen($this->rutaLog . 'josandro.log', 'a');
                    fwrite($file, $msgLog);
                    fclose($file);
                    $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! <br>EL TCL NO FUE EDITADO EN JOSANDRO.');
                }
            } else {
                $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE, EL TCL NO FUE EDITADO EN JOSANDRO');
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
        $idTipoContratoLaboral = (int) $this->params()->fromQuery('idTipoContratoLaboral', 0);
        $infoTCL = $this->DAO->getTCLDetalle($idTipoContratoLaboral);
        $view = new ViewModel(['form' => $infoTCL]);
        $view->setTerminal(true);
        return $view;
    }
    //------------------------------------------------------------------------------   
    public function eliminarAction()
    {
        $idTipoContratoLaboral = (int) $this->params()->fromQuery('idTipoContratoLaboral', 0);
        $infoTCL = $this->DAO->getTCLDetalle($idTipoContratoLaboral);
        $view = new ViewModel(['form' => $infoTCL]);
        $view->setTerminal(true);
        return $view;
    }
    public function deleteAction()
    {
        $idTipoContratoLaboral = (int) $this->params()->fromPost('idTipoContratoLaboral', 0);
        $infosesion = $this->getInfoSesion();
        $registradopor = $infosesion['login'];
        try {
            $this->DAO->eliminar($idTipoContratoLaboral, $registradopor);
            $this->flashMessenger()->addSuccessMessage('EL TCL FUE ELIMINADO EN JOSANDRO');
        } catch (\Exception $ex) {
            $msgLog = "\n" . date('Y-m-d H:i:s') . " ELIMINAR TCL - TipocontratolaboralController->confirmar \n"
                . $ex->getMessage()
                . "\n----------------------------------------------------------------------- \n";
            $file = fopen($this->rutaLog . 'josandro.log', 'a');
            fwrite($file, $msgLog);
            fclose($file);
            $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! EN JOSANDRO.');
        }
        return $this->redirect()->toUrl('index');
    }
    //------------------------------------------------------------------------------   
    public function actualizararchivoAction()
    {
        $idTipoContratoLaboral = (int) $this->params()->fromQuery('idTipoContratoLaboral', 0);
        $form = $this->getFormulario('actualizararchivo', $idTipoContratoLaboral);
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            if ($form->isValid()) {
                $session = $this->getInfoSesion();
                $tclOBJ = new Tipocontratolaboral($form->getData());
                //----------------------------------------------------------------------
                $files = $request->getFiles()->toArray();
                //----------------------------------------------------------------------
                $uploadOK = new \Laminas\Validator\File\UploadFile();
                if (!$uploadOK->isValid($files['plantilla'])) {
                    $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO PRESENTA ERRORES AL CARGAR AL SERVIDOR');
                    return $this->redirect()->toUrl('index');
                }
                if (array_key_exists('plantilla', $files)) {
                    $ext = pathinfo($files['plantilla']['name'], PATHINFO_EXTENSION);
                    $filesize = new \Laminas\Validator\File\Size([
                        'min' => '250B',
                        'max' => '2MB',
                    ]);
                    if (!$filesize->isValid($files['plantilla'])) {
                        $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO NO ESTA EN LOS LIMITES PERMITIDOS. <br> MINIMO: 250B  <br> MAXIMO: <b>2MB</b>');
                        return $this->redirect()->toUrl('index');
                    }
                    $extensiones = new \Laminas\Validator\File\Extension(array('extension' => array('txt')));
                    if (!$extensiones->isValid($files['plantilla'])) {
                        $this->flashMessenger()->addErrorMessage('EL ARCHIVO DE RESPALDO ADJUNTO NO ES PERMITIDO. <br> ARCHIVOS PERMITIDOS: <br> txt');
                        return $this->redirect()->toUrl('index');
                    }
                    $filter = new \Laminas\Filter\File\RenameUpload([
                        'target' => $this->rutaArchivos . 'TCL' . '.' . $ext,
                        'randomize' => true,
                    ]);
                    //----------------------------------------------------------------------
                    $upload = $filter->filter($files['plantilla']);
                    //----------------------------------------------------------------------
                    if ($upload['error'] != 0) {
                        $this->flashMessenger()->addErrorMessage('NO FUE POSIBLE SUBIR EL ARCHIVO DE RESPALDO ADJUNTO.');
                        return $this->redirect()->toUrl('index');
                    }
                    $respaldo = basename($upload['tmp_name']);
                    //----------------------------------------------------------------------
                }
                $tclOBJ->setPlantilla($respaldo);
                $tclOBJ->setModificadopor($session['login']);
                $tclOBJ->setFechahoramod(date('Y-m-d H:i:s'));
                try {
                    $this->DAO->editar($tclOBJ);
                    $this->flashMessenger()->addSuccessMessage('EL TCL FUE EDITADO EN JOSANDRO');
                    return $this->redirect()->toUrl('index');
                } catch (\Exception $ex) {
                    $msgLog = "\n" . date('Y-m-d H:i:s') . " EDITAR TCL - EmpleadoController->registrar \n"
                        . $ex->getMessage()
                        . "\n----------------------------------------------------------------------- \n";
                    $file = fopen($this->rutaLog . 'josandro.log', 'a');
                    fwrite($file, $msgLog);
                    fclose($file);
                    $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE! <br>EL TCL NO FUE EDITADO EN JOSANDRO.');
                }
            } else {
                $this->flashMessenger()->addErrorMessage('SE HA PRESENTADO UN INCONVENIENTE, EL TCL NO FUE EDITADO EN JOSANDRO');
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
}
