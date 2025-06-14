<?php
/**
*    File        : backend/controllers/studentsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/students.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true); //para poder filtrar el id
    
    if (isset($input['id']))  //si lo contiene entonces busca ese unico estudiante
    {
        $student = getStudentById($conn, $input['id']); //en models
        echo json_encode($student);
    } 
    else //y sino me trae todos los estudiantes
    {
        $students = getAllStudents($conn); 
        echo json_encode($students);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = createStudent($conn, $input['fullname'], $input['email'], $input['age']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Estudiante agregado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo agregar"]);
    }
}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Actualizado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    try{
        $result = deleteStudent($conn, $input['id']);
        if ($result['deleted'] > 0) 
        {
            echo json_encode(["message" => "Eliminado correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar"]);
        }
    } catch(mysqli_sql_exception $e){
            if ($e->getCode() === 1451) { // Código de error por restricción de clave foránea
                http_response_code(400);
                echo json_encode(["error" => "No se puede eliminar: el estudiante está relacionado con materias."]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error del servidor: " . $e->getMessage()]);
            }
    }  
}
?>