/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { subjectsAPI } from '../api/subjectsAPI.js';

document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
});

function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  
  form.addEventListener('submit', async e => 
  {
    e.preventDefault();
    const subject = {
      id: document.getElementById('subjectId').value.trim(),
      name: document.getElementById('name').value.trim()
    };

    try 
    {
      if (subject.id) 
      {
        await subjectsAPI.update(subject);
      } 
      else 
      {
        await subjectsAPI.create(subject);
      }

      form.reset();
      document.getElementById('subjectId').value = '';
      loadSubjects();
    } 
    //GUÍA 7: modificacion en catch para inciso a
    catch (err) //err representa el error que fue lanzando en el bloque try
    //fue arrojado por el throw en apiFactory.js
    {
      if (err.message.includes('Ya existe una materia')) 
      {
        alert('Ya existe una materia con ese nombre.');
      } 
      else 
      {
        console.error(err.message);
      }
    }
  });
}


function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

async function loadSubjects()
{
    try
    {
        const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(subjects);
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(subject.name));
        tr.appendChild(createSubjectActionsCell(subject));

        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDeleteSubject(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

async function confirmDeleteSubject(id)
{
    if (!confirm('¿Seguro que deseas borrar esta materia?')) return;
    console.log('Intentando eliminar')
    try
    {
        await subjectsAPI.remove(id);
        loadSubjects();
    }
    catch (err)
    {
        if (err.message.includes('relacionada con estudiantes')) 
        {
            alert('No se puede eliminar: la materia está relacionado con estudiantes.');
        } 
        else 
        {
            alert('Ocurrió un error al borrar el estudiante.');
            console.error('Error al borrar:', err.message);
        }
    }
}
