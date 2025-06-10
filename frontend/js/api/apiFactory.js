/**
*    File        : frontend/js/api/apiFactory.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

export function createAPI(moduleName, config = {})  //recibe dos parametros, el nombre del modulo que le pase "students" por ejemplo de studentsAPI. Y config que por defecto esta vacio pero permite configurar opciones mas avanzadas en caso de que fuera necesario.
{
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;
    //?? si el de la izquierda es null o undefined usa el de la derecha que ahora tiene sentido el moduleName-->
    //en studensAPI yo pase de la nada "students" pero ahora cuando yo lo lo tengo como parametro y use en server tiene sentido-->
    //porque en server despues se hacen cambios con la URL

    //GUÍA 7: cambios en sendJSON para inciso a
    async function sendJSON(method, data) {
        const res = await fetch(API_URL, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        //variable en donde voy a guardar el resultado que devuelva el servidor
        let resJson = null;
        try {
            resJson = await res.json();
        } catch {
            // Por si la respuesta no es JSON, resJson se queda null
        }

        if (!res.ok) {
            // Aquí revisamos si resJson tiene el error para mostrar
            if (resJson && resJson.error) {
                throw new Error(resJson.error);
            } else {
                throw new Error(`Error en ${method}`);
            }
        }

        return resJson;
    }



    return {
        async fetchAll()
        {
            const res = await fetch(API_URL); //obtiene todos los registros del modulo desde el servidor
            if (!res.ok) throw new Error("No se pudieron obtener los datos");
            return await res.json(); //retorna convertidos en un objeto json
        },
        async create(data)
        {
            return await sendJSON('POST', data);
        },
        async update(data)
        {
            return await sendJSON('PUT', data);
        },
        async remove(id)
        {
            return await sendJSON('DELETE', { id });
        }
    };
}
