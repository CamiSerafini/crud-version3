<?php
/**
*    File        : backend/server.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

/**FOR DEBUG: */
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

//entrada al backend. Recibe las solicitudes desde el frontend y redirige al modulo correspondiente (students, subjects, etc)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

function sendCodeMessage($code, $message = "")
{
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

// Respuesta correcta para solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
    sendCodeMessage(200); // 200 OK
}

// Obtener el módulo desde la query string

//Las siguientes 4 lineas extraen el nombre del modulo desde la URL del navegador
$uri = parse_url($_SERVER['REQUEST_URI']);
//toma toda la URL y la separa en partes. Por ejemplo con server.php?module=students
//$_SERVER['REQUEST_URI'] contiene la ruta completa que pidió el navegador
//parse_url separa
/*[
  'path' => '/server.php',
  'query' => '?module=estudiantes'
]*/
$query = $uri['query'] ?? '';
//extrae solo la parte del query string
//$query = 'module=estudiantes'
parse_str($query, $query_array);
//convierte el string en un array asociativo
//$query = 'module=estudiantes';
//$query_array = ['module' => 'estudiantes'];
$module = $query_array['module'] ?? null;
//tendrá el valor "students"

// Validación de existencia del módulo
if (!$module)
{
    sendCodeMessage(400, "Módulo no especificado");
}

// Validación de caracteres seguros: solo letras, números y guiones bajos
if (!preg_match('/^\w+$/', $module))
{
    sendCodeMessage(400, "Nombre de módulo inválido");
}

// Buscar el archivo de ruta correspondiente
$routeFile = __DIR__ . "/routes/{$module}Routes.php";
//__DIR__ es una constante de PHP que me devuelve la ruta absoluta del
//contiene la ruta de la carpeta, en este caso /backend
//convierte {$module} teniendo asi la ruta completa del archivo
//Quedaría por ejemplo backend/routes/studentsRoutes.php (en los demas casos sería subjects o studentsSubjects)

if (file_exists($routeFile))
{
    require_once($routeFile);
}
else
{
    sendCodeMessage(404, "Ruta para el módulo '{$module}' no encontrada");
}
//Inluimos el archivo que define las rutas o la lógica que responderá la petición y ejecutamos con require_once.
//Se encarga de manejar GET, POST, etc. 
//Si no existe, 404