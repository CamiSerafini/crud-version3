<?php
/**
*    File        : backend/routes/studentsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

//este archivo actua como puente entre la solicitud que llega del frontend y el controlador que se encarga de procesarla

require_once("./config/databaseConfig.php"); //datos para la conexion a base de datos
require_once("./routes/routesFactory.php"); //// con funcion routeRequest que gestiona las rutas generales para GET, POST, etc.
require_once("./controllers/studentsController.php"); //contiene funciones para consultar, insertar, modificar o borrar, en este caso estudiantes.

// routeRequest($conn);


/**
 * Ejemplo de como se extiende un archivo de rutas 
 * para casos particulares
 * o validaciones:
 */
routeRequest/*funcion definida en routesFactory.php*/($conn, [
    'POST' => function($conn) 
    {
        // Validación o lógica extendida
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['fullname'])) 
        {
            http_response_code(400);
            echo json_encode(["error" => "Falta el nombre"]);
            return;
        }
        handlePost($conn); //definida en studentsController.php
    }
]);