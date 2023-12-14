const container = document.getElementById("content");

content.innerHTML = `
<h1>Principal</h1>


`;

const setRedirectContent = async (contentID) => {

    switch (contentID) {
        case 0:
            content.innerHTML = `
            <div class="container mt-5">
                <h2 class="mb-4">Lista de Pacientes</h2>
            
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateTableRows(dataPatients)}
                    </tbody>
                </table>
            </div>

            <div class="container mt-5">
            <h2 class="mb-4">Agregar Paciente</h2>

                <form id="patientForm">
                    <div class="form-group mt-4">
                        <label for="nombre">Nombre:</label>
                        <input type="text" class="form-control" id="nombre" placeholder="Ingrese el nombre" required>
                    </div>
                    <div class="form-group mt-4">
                        <label for="apellido">Apellido:</label>
                        <input type="text" class="form-control" required id="apellido" placeholder="Ingrese el apellido" required>
                    </div>
                </form>

                <button type="button" id="addPatient" class="btn btn-success mt-4">Agregar Paciente</button>

            </div>
            
            `;

            break;
        case 1:
            content.innerHTML = `
                <h1>Test 1</h1>
            
            
            `;
            break;

        case 2:
            content.innerHTML = `
                <h1>Test 2</h1>
            
            
            `;
            break;

        default:
            break;
    }
};

