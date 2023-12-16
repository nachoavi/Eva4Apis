const content = document.getElementById("content");

const generateTableRows = (dataDoctors) => {
    return dataDoctors
        .map(
            (doctor) => `
        <tr>
            <td>${doctor.id}</td>
            <td>${doctor.name}</td>
            <td>${doctor.specialty}</td>
            <td>${doctor.available ? "Disponible" : "No Disponible"}</td>
            <td>${doctor.ranking || "N/A"}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteDoctor(${
                    doctor.id
                })">Eliminar</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="updateDoctor(${
                    doctor.id
                }, '${doctor.name}', '${doctor.specialty}', ${
                doctor.available
            }, ${doctor.ranking})">Actualizar</button>
            </td>
        </tr>
    `
        )
        .join("");
};

const addNewDoctor = async (name, specialty, available, ranking) => {
    const doctor = {
        name: name,
        specialty: specialty,
        available: available,
        ranking: ranking,
    };

    try {
        await fetch("http://127.0.0.1:8000/doctors/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doctor),
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const deleteDoctor = async (doctorId) => {
    try {
        await fetch(`http://127.0.0.1:8000/doctors/${doctorId}`, {
            method: "DELETE",
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const updateDoctor = async (doctorId, name, specialty, available, ranking) => {
    window.location.href = `update.html?id=${doctorId}&name=${name}&specialty=${specialty}&available=${available}&ranking=${ranking}`;
};

const fetchDataAndRender = async () => {
    let dataDoctors;

    try {
        const doctorsResponse = await fetch("http://127.0.0.1:8000/doctors/", {
            method: "GET",
        });

        dataDoctors = await doctorsResponse.json();
    } catch (error) {
        console.error("Error:", error);
    }

    content.innerHTML = `
    <div class="container mt-5">
        <h2 class="mb-4">Lista de Doctores</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Disponibilidad</th>
                    <th>Ranking</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows(dataDoctors)}
            </tbody>
        </table>
    </div>

    <div class="container mt-5">
        <h2 class="mb-4">Agregar Doctor</h2>
        <form id="doctorForm">
            <div class="form-group mt-4">
                <label for="nombre">Nombre:</label>
                <input type="text" class="form-control" id="nombre" placeholder="Ingrese el nombre" required>
            </div>
            <div class="form-group mt-4">
                <label for="especialidad">Especialidad:</label>
                <input type="text" class="form-control" id="especialidad" placeholder="Ingrese la especialidad" required>
            </div>
            <div class="form-check mt-4">
                <input type="checkbox" class="form-check-input" id="disponible" checked>
                <label class="form-check-label" for="disponible">Disponible</label>
            </div>
            <div class="form-group mt-4">
                <label for="ranking">Ranking:</label>
                <input type="number" class="form-control" step="any" id="ranking" placeholder="Ingrese el ranking">
            </div>
            <button type="submit" class="btn btn-success mt-4">Agregar Doctor</button>
        </form>
    </div>

    <div class="container mt-5">
        <button type="button" class="btn btn-primary" id="showTopButton">Mostrar Top</button>
        <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top</button>
        <div id="topDoctorsTableContainer" style="display:none;">
            <h2 class="mb-4">Top Doctores</h2>
            <table class="table table-bordered" id="topDoctorsTable">
                <!-- Table for Top Doctors will be generated here -->
            </table>
        </div>
    </div>
    `;

const showTopButton = document.getElementById("showTopButton");
const topDoctorsTableContainer = document.getElementById("topDoctorsTableContainer");
const topDoctorsTable = document.getElementById("topDoctorsTable");

showTopButton.addEventListener("click", async () => {
    try {
        const topDoctorsResponse = await fetch("http://127.0.0.1:8000/doctors/top", {
            method: "GET",
        });

        const topDoctorsData = await topDoctorsResponse.json();

        topDoctorsTable.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Disponibilidad</th>
                    <th>Ranking</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows(topDoctorsData)}
            </tbody>
        `;

        topDoctorsTableContainer.style.display = "block";
        showTopButton.style.display = "none";
        hideTopButton.style.display = "inline";
    } catch (error) {
        console.error("Error fetching top doctors:", error);
    }
});

hideTopButton.addEventListener("click", () => {
    topDoctorsTableContainer.style.display = "none";
    showTopButton.style.display = "inline";
    hideTopButton.style.display = "none";
});


    const doctorForm = document.getElementById("doctorForm");

    doctorForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreInput = document.getElementById("nombre");
        const especialidadInput = document.getElementById("especialidad");
        const disponibleInput = document.getElementById("disponible");
        const rankingInput = document.getElementById("ranking");

        addNewDoctor(
            nombreInput.value,
            especialidadInput.value,
            disponibleInput.checked,
            rankingInput.value
        );
    });
};

fetchDataAndRender();
