/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

// Si yo en html no usaba type="module" con este archivo, no me funcionaría el siguiente import
import { studentsAPI } from '../api/studentsAPI.js'; 
// lo utiliza para acceder al backend y poder crear, obtener, actualizar y borrar datos (delegando esto a la API)
// studentsAPI es una constante creada en esa URL (justo la url y constante se llaman igual)

document.addEventListener('DOMContentLoaded', () => 
// espera a que termine de cargar el html completo
{
    // las siguientes 3 funciones estan en este mismo .js
    loadStudents(); //esta es la funcion que carga y muestra a todos los estudiantes en la tabla
    setupFormHandler(); //prepara el form. para que al "guardar" se capture y procese la info
    setupCancelHandler(); //configura el comportamiento del boton cancelar
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault(); //al enviarse el formulario no se recarga la pagina
        const student = getFormData(); //funcion que esta en este mismo archivo, me trae el id del formulario
    
        try 
        {
            if (student.id) //si existe
            {
                await studentsAPI.update(student); //lo edita, esto esta en el apiFactory pero lo importo desde studentsAPI
            } 
            else 
            {
                await studentsAPI.create(student); //lo crea, esto esta en el apiFactory pero lo importo desde studentsAPI
            }
            clearForm(); //limpia el formulario, funcion en este mismo archivo
            loadStudents(); // vuelve a cargarme los estudiantes en la tabla para actualizar lo que sea que haya hecho
        }
        catch (err)
        {
            console.error(err.message); //error inesperado para el cual no fue preparado el programa
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = ''; //se borra el valor del campo oculto studentId, era el Id del input con hidden del html
    });
}
  
function getFormData() //se crea un objeto con los datos del formulario
{
    return {
        id: document.getElementById('studentId').value.trim(), //trim me elimina los espacios en blanco al final y principio de un texto
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10) //me lo convierte a entero en base decimal
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset(); //limpia todos los campos del formulario
    document.getElementById('studentId').value = ''; //se borra el valor del campo oculto para que no se reutilice cuando se haga una nueva alta
}
  
async function loadStudents()
{
    try 
    {
        const students = await studentsAPI.fetchAll(); //para obtener todos los estudiantes desde el backend
        renderStudentTable(students); //en este mismo archivo
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren(); //elimina las filas anteriores para empezar desde cero
  
    students.forEach(student => //por cada estudiante me va a agregar una fila
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname)); //en la fila me va a agregar las celdas
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr); //agrego la fila al body
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text; //usar textContent. NUNCA INNER HTML para evitar la ejecución de scripts mailiciosos y el robo de info (ataques XSS).
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student)); //si hace click me agrega los datos en el fomrulario para editar lo que quiera
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return; //si pone cancelar no hace nada pero si acepta sigue con lo siguiente
  
    try 
    {
        await studentsAPI.remove(id); //esta en el otro archivo
        loadStudents(); //me actualiza los cambios
    } 
    catch (err) 
    {
        console.error('Error al borrar:', err.message);
    }
}
  