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
        const response = await fetch("http://127.0.0.1:8000/patients/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patient),
        });

        const data = await response.json()

        if (data.error) {
            alert(data.error)
        }

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

const generateTopPatientsTableRows = (topPatientsData) => {
    return topPatientsData
        .map(
            (patient) => `
        <tr>
            <td>${patient.patient_id}</td>
            <td>${patient.patient_name}</td>
            <td>${patient.patient_lastname}</td>
            <td>${patient.total_hours}</td>
        </tr>
    `
        )
        .join("");
};

const fetchDataAndRender = async () => {
    let dataPatients;
    let topPatientsData;

    try {
        const patientsResponse = await fetch(
            "http://127.0.0.1:8000/patients/",
            {
                method: "GET",
            }
        );

        dataPatients = await patientsResponse.json();


        const topPatientsResponse = await fetch("http://127.0.0.1:8000/patients/top", {
            method: "GET",
        });

        topPatientsData = await topPatientsResponse.json();
    } catch (error) {
        console.error("Error:", error);
    }

    
    if (dataPatients.message) {
        content.innerHTML = `
    <div>
        <div class="container mt-5">
            <h2 class="mb-4">Lista de Pacientes</h2>

            <p>${dataPatients.message}</p>
        </div>

        <div class="container mt-5">
            <h2 class="mb-4">Agregar Paciente</h2>

            <form id="patientForm">
                <div class="form-group mt-4">
                    <label for="nombre">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" placeholder="Ingrese el nombre" >
                </div>
                <div class="form-group mt-4">
                    <label for="apellido">Apellido:</label>
                    <input type="text" class="form-control" id="apellido" placeholder="Ingrese el apellido" >
                </div>

                <button type="submit" class="btn btn-success mt-4">Agregar Paciente</button>

            </form>
        </div>
    </div>

    <div class="container mt-5">
        <button type="button" class="btn btn-primary" id="showTopButton">Mostrar Top Pacientes</button>
        <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top Pacientes</button>
        <div id="topPatientsTableContainer" style="display:none;">
            <h2 class="mb-4">Top Pacientes</h2>
            <table class="table table-bordered" id="topPatientsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Total de Horas</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateTopPatientsTableRows(topPatientsData)}
                </tbody>
            </table>
        </div>
    </div>
    `;
        
    } else {
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
                    <input type="text" class="form-control" id="nombre" placeholder="Ingrese el nombre" >
                </div>
                <div class="form-group mt-4">
                    <label for="apellido">Apellido:</label>
                    <input type="text" class="form-control" id="apellido" placeholder="Ingrese el apellido" >
                </div>

                <button type="submit" class="btn btn-success mt-4">Agregar Paciente</button>

            </form>
        </div>
    </div>

    <div class="container mt-5">
        <button type="button" class="btn btn-primary" id="showTopButton">Mostrar Top Pacientes</button>
        <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top Pacientes</button>
        <div id="topPatientsTableContainer" style="display:none;">
            <h2 class="mb-4">Top Pacientes</h2>
            <table class="table table-bordered" id="topPatientsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Total de Horas</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateTopPatientsTableRows(topPatientsData)}
                </tbody>
            </table>
        </div>
    </div>
    `;
    }

    const patientForm = document.getElementById("patientForm");

    patientForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreInput = document.getElementById("nombre");
        const apellidoInput = document.getElementById("apellido");
        addNewPatient(nombreInput.value, apellidoInput.value);
    });

    const showTopButton = document.getElementById("showTopButton");
    const hideTopButton = document.getElementById("hideTopButton");
    const topPatientsTableContainer = document.getElementById("topPatientsTableContainer");

    showTopButton.addEventListener("click", async () => {
        try {
            const topPatientsResponse = await fetch("http://127.0.0.1:8000/patients/top", {
                method: "GET",
            });

            const topPatientsData = await topPatientsResponse.json();

            const topPatientsTable = document.getElementById("topPatientsTable");
            topPatientsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Total de Horas</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateTopPatientsTableRows(topPatientsData)}
                </tbody>
            `;

            topPatientsTableContainer.style.display = "block";
            showTopButton.style.display = "none";
            hideTopButton.style.display = "inline";
        } catch (error) {
            console.error("Error fetching top patients:", error);
        }
    });

    hideTopButton.addEventListener("click", () => {
        topPatientsTableContainer.style.display = "none";
        showTopButton.style.display = "inline";
        hideTopButton.style.display = "none";
    });
};

fetchDataAndRender();
