<?php

namespace Usermanager\Modelo\DAO;

use Laminas\Db\TableGateway\AbstractTableGateway;
use Laminas\Db\Adapter\Adapter;
use Laminas\Db\Sql\Expression;
use Laminas\Db\Sql\Select;
use Laminas\Db\Sql\Insert;
use Laminas\Db\Sql\Update;
use Usermanager\Modelo\Entidades\Acceso;
use Usermanager\Modelo\Entidades\Empleadocliente;

class AccesoDAO extends AbstractTableGateway
{

    protected $table = 'usuario';

    //------------------------------------------------------------------------------

    public function __construct(Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    //------------------------------------------------------------------------------
    public function fetchAll($filtro = '')
    {
        $this->table = 'usuario';
        $select = new Select($this->table);
        if ($filtro != '') {
            $select->where($filtro);
        } else {
            $select->order("usuario.idUsuario DESC")->limit(25);
        }
        //        echo $select->getSqlString();
        return $this->selectWith($select)->toArray();
    }
    public function getEmpleados($filtro = '')
    {
        $this->table = 'empleadocliente';
        $select = new Select($this->table);
        $select->where($filtro);
        //        echo $select->getSqlString();
        return $this->selectWith($select)->toArray();
    }
    public function getEmpleadoCliente($idEmpleadoCliente = 0)
    {
        $select = new Select('empleadocliente');
        $select->columns(array(
            'idEmpleadoCliente',
            'nombre',
            'apellido',
            'tipoIdentificacion',
            'identificacion',
            'fechaNacimiento',
            'email',
            'telefono',
            'direccion',
            'estado',
            'genero',
            'registradopor',
            'modificadopor',
            'fechahorareg',
            'fechahoramod',
        ))->where("empleadocliente.idEmpleadoCliente = $idEmpleadoCliente")->limit(1);
        //        echo $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if (count($datos) > 0) {
            return $datos[0];
        } else {
            return null;
        }
    }
    public function existeLogin($login = '')
    {
        $this->table = 'usuario';
        $select = new Select($this->table);
        $select->columns(array('existe' => new Expression('COUNT(idUsuario)')))
            ->where(array('login' => $login));
        //        print $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if ($datos[0]['existe'] > 0) {
            return true;
        } else {
            return false;
        }
    }
    public function getCL($idUsuario = 0)
    {
        return new Acceso($this->select(array('idUsuario' => $idUsuario))->current()->getArrayCopy());
    }
    //------------------------------------------------------------------------------

    public function registrar(Acceso $tclOBJ = null)
    {
        try {
            $this->table = 'usuario';
            $insert = new Insert($this->table);
            $datos = $tclOBJ->getArrayCopy();
            unset($datos['idUsuario']);
            $insert->values($datos);
            //echo $insert->getSqlString();
            $this->insertWith($insert);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }
    public function editar(Acceso $tclOBJ = null)
    {
        try {
            $this->table = 'usuario';
            $idUsuario = (int) $tclOBJ->getidUsuario();
            $update = new Update($this->table);
            $datos = $tclOBJ->getArrayCopy();
            $update->set($datos);
            $update->where("usuario.idUsuario =  $idUsuario");
            //echo $update->getSqlString();
            return $this->updateWith($update);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }


    public function eliminar(Acceso $tclOBJ = null)
    {
        try {
            $this->table = "usuario";
            $update = new Update($this->table);
            $update->set([
                'estado' => 'Anulado',
                'modificadopor' => $tclOBJ->getModificadopor(),
                'fechahoramod' => $tclOBJ->getFechahoramod(),
            ]);
            $update->where("usuario.idUsuario = " . $tclOBJ->getidUsuario());
            //echo $update->getSqlString();
            $this->updateWith($update);
        } catch (\Exception $e) {
            throw new \Exception($e);
        }
    }

    //------------------------------------------------------------------------------
    public function getTCLs($filtro = '')
    {
        $this->table = 'tipo_usuario';
        $select = new Select($this->table);
        if ($filtro != '') {
            $select->where($filtro);
        } else {
            $select->order("tipo_usuario.idUsuario DESC");
        }
        //        echo $select->getSqlString();
        return $this->selectWith($select)->toArray();
    }
    public function getTCLDetalle($idUsuario = 0)
    {
        $this->table = 'tipo_usuario';
        $select = new Select($this->table);
        $select->where("tipo_usuario.idUsuario = $idUsuario")->limit(1);
        //        echo $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if (count($datos) > 0) {
            return $datos[0];
        } else {
            return null;
        }
    }
    public function getTclOBJ($idUsuario = 0)
    {
        $this->table = 'tipo_usuario';
        $select = new Select($this->table);
        $select->where('tipo_usuario.idUsuario = ' . $idUsuario);
        //        print $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        foreach ($datos as $dato) {
            return new TipoAcceso($dato);
        }
        return null;
    }
    //------------------------------------------------------------------------------
    public function getInfoEmpleado($autocompletar = '')
    {
        $select = new Select('empleado');
        $select->columns(array(
            'idEmpleado',
            'nombre' => new \Laminas\Db\Sql\Expression("CONCAT(empleado.nombre1, ' ', empleado.nombre2, ' ', empleado.apellido1, ' ', empleado.apellido2)")
        ));
        $select->where("empleado.nombre1 like '%$autocompletar%' OR empleado.nombre2 like '%$autocompletar%' OR empleado.apellido1 like '%$autocompletar%' OR empleado.apellido2 like '%$autocompletar%'");
        //        echo $select->getSqlString();
        return $this->selectWith($select)->toArray();
    }
    //------------------------------------------------------------------------------
    public function getEmpleado($idEmpleado = 0)
    {
        $this->table = 'empleado';
        $select = new Select($this->table);
        $select->where("empleado.idEmpleado = $idEmpleado")->limit(1);
        //        echo $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if (count($datos) > 0) {
            return $datos[0];
        } else {
            return null;
        }
    }
    //------------------------------------------------------------------------------
    public function getEmpleadoByIdentificacion($identificacion = 0)
    {
        $this->table = 'empleado';
        $select = new Select($this->table);
        $select->where("empleado.identificacion = $identificacion")->limit(1);
        //        echo $select->getSqlString();
        $datos = $this->selectWith($select)->toArray();
        if (count($datos) > 0) {
            return $datos[0];
        } else {
            return null;
        }
    }
    //------------------------------------------------------------------------------
}
