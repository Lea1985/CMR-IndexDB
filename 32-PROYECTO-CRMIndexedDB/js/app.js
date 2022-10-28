(function() {

    let DB;

    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {

        crearDB();

        if (window, indexedDB.open('crm', 1)) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', elimarRegistro)

    });


    function elimarRegistro(e) {

        if (e.target.classList.contains('eliminar')) {

            const idEliminar = Number(e.target.dataset.cliente);

            console.log(Number(idEliminar));

            Swal.fire({
                title: 'Estas seguro?',
                text: "No seras capaz de revertir esta accion!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrarlo!'
            }).then((result) => {
                if (result.isConfirmed) {

                    const transaction = DB.transaction(['crm'], 'readwrite');
                    const objectStore = transaction.objectStore('crm');


                    objectStore.delete(idEliminar);

                    transaction.oncomplete = () => {
                        e.target.parentElement.parentElement.remove();
                    }

                    transaction.onerror = () => {
                        console.log('Hubo un error');
                    }

                    Swal.fire(
                        'Eliminado!',
                        'El cliente ha sido eliminado.',
                        'Exito'
                    )
                }
            });


        }

    }

    // Crear la base de dato en indexDB

    function crearDB() {

        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = () => {
            console.log('Hubo un error');
        }

        crearDB.onsuccess = () => {

            DB = crearDB.result;

        }

        crearDB.onupgradeneeded = function(e) {

            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('Db se creo correctamante');

        }

    }


    function obtenerClientes() {

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () => {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = () => {

            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {

                const cursor = e.target.result;


                if (cursor) {
                    const { nombre, email, telefono, empresa, id } = cursor.value;


                    listadoClientes.innerHTML += ` 
                    <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar"  onclick="executeExample('warningConfirm')">Eliminar</a>
                    </td>
                </tr>
            `;


                    cursor.continue();
                } else {
                    console.log('No hay mas registros....')
                }
            }



        }


    }



})();