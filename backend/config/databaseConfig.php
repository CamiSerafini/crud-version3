<?php
/**
*    File        : backend/config/databaseConfig.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

//*GUIA 7: la siguiente linea es para que los errores que son de MYSQL
//como claves duplicadas cuando ponemos UNIQUE, se lancen como excepciones.
//mysqli_sql_exception (continuo en subjectsController.php)
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = "localhost";
$user = "students_user_3";
$password = "12345";
$database = "students_db_3";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) 
{
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed"]));
}
?>