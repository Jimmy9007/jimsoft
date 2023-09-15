<?php

namespace Administracion\Modelo\DAO;

use Laminas\Db\TableGateway\AbstractTableGateway;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Expression;
use Laminas\Db\Sql\Select;
use Laminas\Db\Sql\Insert;
use Laminas\Db\Sql\Update;
use Administracion\Modelo\Entidades\Evento;

class EventoDAO extends AbstractTableGateway
{

    protected $table = 'eventos';

    //------------------------------------------------------------------------------

    public function __construct(Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    //------------------------------------------------------------------------------
    public function fetchAll($filtro = '')
    {
        $this->table = 'eventos';
        $select = new Select($this->table);
        $select->columns([
            'idEvento',
            'title',
            'descripcion',
            'start',
            'end',
            'color',
            'textColor',
            'allDay',
            'estado',
            'registradopor',
            'modificadopor',
            'fechahorareg',
            'fechahoramod',
        ]);
        if ($filtro != '') {
            $select->where($filtro);
        } else {
            $select->order("eventos.idEvento DESC")->limit(25);
        }
        //        echo $select->getSqlString();
        return $this->selectWith($select)->toArray();
    }
    public function getEventoDetalle($idEvento = 0)
    {
        $select = new Select('eventos');
        $select->columns(array(
            'idEvento',
            'title',
            'descripcion',
            'start',
            'end',
            'color',
            'textColor',
            'allDay',
            'estado',
            'registradopor',
            'modificadopor',
            'fechahorareg',
            'fechahoramod',
        ))->where("eventos.idEvento = $idEvento")->limit(1);
        //        echo $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if (count($datos) > 0) {
            return $datos[0];
        } else {
            return null;
        }
    }
    public function getEvento($idEvento = 0)
    {
        return new Evento($this->select(array('idEvento' => $idEvento))->current()->getArrayCopy());
    }
    //------------------------------------------------------------------------------

    public function registrar(Evento $eventoOBJ = null)
    {
        try {
            $this->table = 'eventos';
            $insert = new Insert($this->table);
            $datos = $eventoOBJ->getArrayCopy();
            unset($datos['idEvento']);
            $insert->values($datos);
            $this->insertWith($insert);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }
    public function editar(Evento $eventoOBJ = null)
    {
        try {
            $this->table = 'eventos';
            $idEvento = (int) $eventoOBJ->getIdEvento();
            $update = new Update($this->table);
            $datos = $eventoOBJ->getArrayCopy();
            $update->set($datos);
            $update->where("eventos.idEvento =  $idEvento");
            //echo $update->getSqlString();
            return $this->updateWith($update);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }
    public function eliminar($idEvento = 0, $registradopor = '')
    {
        try {
            $this->table = "eventos";
            $update = new Update($this->table);
            $update->set([
                'estado' => 'Eliminado',
                'modificadopor' => $registradopor,
                'fechahoramod' => date('Y-m-d H:i:s'),
            ]);
            $update->where("eventos.idEvento = $idEvento");
            //echo $update->getSqlString();
            $this->updateWith($update);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }

    //------------------------------------------------------------------------------
    public function moverevento($idEvento = 0, $start = '', $end = '', $registradopor = '')
    {
        try {
            $this->table = 'eventos';
            $update = new Update($this->table);
            $update->set([
                'start' => $start,
                'end' => $end,
                'modificadopor' => $registradopor,
                'fechahoramod' => date('Y-m-d H:i:s'),
            ]);
            $update->where("eventos.idEvento =  $idEvento");
            //echo $update->getSqlString();
            return $this->updateWith($update);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }
    //------------------------------------------------------------------------------
}
