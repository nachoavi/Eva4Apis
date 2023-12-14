const content = document.getElementById("content");

const generateTableRows = (dataPatients) => {
    return dataPatients
        .map(
            (patient) => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.lastname}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="deletePatient(${patient.id})">Eliminar</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="updatePatient(${patient.id}, '${patient.name}', '${patient.lastname}')">Actualizar</button>
            </td>
        </tr>
    `
        )
        .join("");
};

const addNewPatient = async (name, lastname) => {
    const patient = {
        name: name,
        lastname: lastname,
    };

    try {
        await fetch("http://127.0.0.1:8000/patients/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patient),
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const deletePatient = async (patientId) => {
    try {
        await fetch(`http://127.0.0.1:8000/patients/${patientId}`, {
            method: "DELETE",
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const updatePatient = async (patientId, name, lastname) => {
    window.location.href = `update.html?id=${patientId}&name=${name}&lastname=${lastname}`;
};

const fetchDataAndRender = async () => {
    let dataPatients;

    try {
        const patientsResponse = await fetch(
            "http://127.0.0.1:8000/patients/",
            {
                method: "GET",
            }
        );

        dataPatients = await patientsResponse.json();
    } catch (error) {
        console.error("Error:", error);
    }

    content.innerHTML = `
    
    <div>
    <div class="container mt-5">
        <h2 class="mb-4">Lista de Pacientes</h2>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th>
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
                <input type="text" class="form-control" id="apellido" placeholder="Ingrese el apellido" required>
            </div>

            <button type="submit" class="btn btn-success mt-4">Agregar Paciente</button>

        </form>
    </div>
    </div>
    `;

    const patientForm = document.getElementById("patientForm");

    patientForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreInput = document.getElementById("nombre");
        const apellidoInput = document.getElementById("apellido");
        addNewPatient(nombreInput.value, apellidoInput.value);
    });
};

fetchDataAndRender();
