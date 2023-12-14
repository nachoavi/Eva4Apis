const content = document.getElementById("content");

const generateTableRows = (bookingWithData) => {
    return bookingWithData
        .map(
            (booking) => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.doctor.name}</td>
            <td>${booking.doctor.specialty}</td>
            <td>${booking.patient.name}</td>
            <td>${booking.hour}</td>
            <td>${booking.date}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteBooking(${
                    booking.id
                })">Eliminar</button>
                <button type="button" class="btn btn-primary btn-sm" onclick="updateBooking(${
                    booking.id
                }, '${booking.doctor.id}', '${booking.patient.id}', '${booking.date}', '${booking.hour}')">Actualizar</button>
            </td>
        </tr>
    `
        )
        .join("");
};

const addNewBooking = async (doctorId, patientId, date, hour, specialty) => {
    const booking = {
        booking_date: date,
        booking_hour: hour,
        specialty: specialty,
        doctor: doctorId,
        patient: patientId,
    };

    try {
        await fetch("http://127.0.0.1:8000/bookings/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(booking),
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const deleteBooking = async (bookingId) => {
    try {
        await fetch(`http://127.0.0.1:8000/bookings/${bookingId}`, {
            method: "DELETE",
        });

        fetchDataAndRender();
    } catch (error) {
        console.log("Error");
    }
};

const updateBooking = async (bookingId, doctorId, patientId, date, hour) => {
    window.location.href = `update.html?id=${bookingId}&doctor=${doctorId}&patient=${patientId}&date=${date}&hour=${hour}`;
};

const fetchDataAndRender = async () => {
    let bookingWithData;
    let dataDoctors;
    let dataPatients;

    try {
        const bookings = await fetch("http://127.0.0.1:8000/bookings/", {
            method: "GET",
        });

        let bookingData = await bookings.json();

        const doctors = await fetch("http://127.0.0.1:8000/doctors/", {
            method: "GET",
        });

        dataDoctors = await doctors.json();

        const patients = await fetch("http://127.0.0.1:8000/patients/", {
            method: "GET",
        });

        dataPatients = await patients.json();

        const bookingWithDoctorData = bookingData.map((booking) => {
            const doctorInfo = dataDoctors.find((doctor) => doctor.id === booking.doctor);
            return {
                id: booking.id,
                doctor: doctorInfo,
                specialty: doctorInfo ? doctorInfo.specialty : null,
                patient: booking.patient,
                hour: booking.booking_hour,
                date: booking.booking_date,
            };
        });

        bookingWithData = bookingWithDoctorData.map((booking) => {
            const patientInfo = dataPatients.find((patient) => patient.id === booking.patient);
            return {
                ...booking,
                patient: patientInfo,
            };
        });

        console.log(bookingWithData);
    } catch (error) {
        console.error("Error:", error);
    }

    content.innerHTML = `
    <div class="container mt-5">
        <h2 class="mb-4">Reservas</h2>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Doctor</th>
                    <th>Especialidad</th>
                    <th>Paciente</th>
                    <th>Hora</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableRows(bookingWithData)}
            </tbody>
        </table>
    </div>

    <div class="container mt-5">
        <h2 class="mb-4">Crear reserva</h2>
        <form id="bookingForm">
            <div class="form-group mt-4">
                <label for="doctor">Doctor:</label>
                <select type="text" class="form-control" id="doctor" required>
                    ${dataDoctors.map((doctor) => `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`).join("")}
                </select>
            </div>
            <div class="form-group mt-4">
                <label for="patient">Paciente:</label>
                <select type="text" class="form-control" id="patient" required>
                    ${dataPatients.map((patient) => `<option value="${patient.id}">${patient.name} ${patient.lastname}</option>`).join("")}
                </select>
            </div>
            <div class="form-group mt-4">
                <label for="date">Fecha:</label>
                <input type="date" class="form-control" id="date" required>
            </div>
            <div class="form-group mt-4">
                <label for="hour">Hora:</label>
                <input type="time" class="form-control" id="hour" required>
            </div>
            <button type="submit" class="btn btn-success mt-4">Agregar Reserva</button>
        </form>
    </div>

    <div class="container mt-5">
        <button type="button" class="btn btn-primary" id="showTopButton">Mostrar Top</button>
        <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top</button>
        <div id="topDoctorsTableContainer" style="display:none;">
            <h2 class="mb-4">Top especialidades</h2>
            <table class="table table-bordered" id="topDoctorsTable">
                <!-- Table for Top Doctors will be generated here -->
            </table>
        </div>
    </div>
    `;

    const bookingForm = document.getElementById("bookingForm");

    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const doctorInput = document.getElementById("doctor");
        const patientInput = document.getElementById("patient");
        const dateInput = document.getElementById("date");
        const hourInput = document.getElementById("hour");
    
        const selectedDoctorId = doctorInput.value;
        
        const selectedDoctor = dataDoctors.find((doctor) => doctor.id === parseInt(selectedDoctorId));
        const selectedSpecialty = selectedDoctor ? selectedDoctor.specialty : null;
    
        console.log(selectedSpecialty);
    
        addNewBooking(
            selectedDoctorId,
            patientInput.value,
            dateInput.value,
            hourInput.value,
            selectedSpecialty
        );
    });

    const showTopButton = document.getElementById("showTopButton");
    const hideTopButton = document.getElementById("hideTopButton");
    const topDoctorsTableContainer = document.getElementById("topDoctorsTableContainer");
    const topDoctorsTable = document.getElementById("topDoctorsTable");
    
    showTopButton.addEventListener("click", async () => {
        try {
            const topSpecialtiesResponse = await fetch("http://127.0.0.1:8000/bookings/top-specialties/", {
                method: "GET",
            });
    
            const topSpecialtiesData = await topSpecialtiesResponse.json();
    
            topDoctorsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Especialidad</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateSpecialtiesTableRows(topSpecialtiesData)}
                </tbody>
            `;
    
            topDoctorsTableContainer.style.display = "block";
            showTopButton.style.display = "none";
            hideTopButton.style.display = "inline";
        } catch (error) {
            console.error("Error fetching top specialties:", error);
        }
    });
    
    hideTopButton.addEventListener("click", () => {
        topDoctorsTableContainer.style.display = "none";
        showTopButton.style.display = "inline";
        hideTopButton.style.display = "none";
    });
    
    const generateSpecialtiesTableRows = (topSpecialtiesData) => {
        return topSpecialtiesData
            .map(
                (specialty) => `
                <tr>
                    <td>${specialty.specialty}</td>
                    <td>${specialty.total}</td>
                </tr>
            `
            )
            .join("");
    };
};

fetchDataAndRender();
