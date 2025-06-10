<?php
/**
*    File        : backend/controllers/subjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/subjects.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) 
    {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } 
    else 
    {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    $name = $input['name'];

    try 
    {
        $result = createSubject($conn, $name);

        if ($result['inserted'] > 0) 
        {
            echo json_encode(["message" => "Materia creada correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo crear"]);
        }
    } 
    //GUIA 7: Mejor manejo de errores en el catch para el punto a de la guía 7
    //continua con cambios para este inciso en JavaScript apiFactory.js
    catch (mysqli_sql_exception $e) 
    {
        //tiene en cuenta el error lanzado de MySQL
        if ($e->getCode() === 1062) // Código de error de MySQL para clave duplicada
        {
            http_response_code(400); // Error del cliente
            echo json_encode(["error" => "Ya existe una materia con ese nombre"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "Error del servidor: " . $e->getMessage()]);
        }
    }
}


function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateSubject($conn, $input['id'], $input['name']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Materia actualizada correctamente"]);
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
        $result = deleteSubject($conn, $input['id']);
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
                echo json_encode(["error" => "No se puede eliminar: la materia está relacionada con estudiantes."]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error del servidor: " . $e->getMessage()]);
            }
    }
}
?>