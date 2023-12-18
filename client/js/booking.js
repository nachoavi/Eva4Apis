const content = document.getElementById("content");

const generateTableRows = (bookingWithData) => {

    try {
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
        
    } catch (error) {
        return `
        <tr>No existen horas reservadas</tr>
        `
    }

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
    let bookingData

    try {
        const bookings = await fetch("http://127.0.0.1:8000/bookings/", {
            method: "GET",
        });

        bookingData = await bookings.json();

        const doctors = await fetch("http://127.0.0.1:8000/doctors/", {
            method: "GET",
        });

        dataDoctors = await doctors.json();

        const patients = await fetch("http://127.0.0.1:8000/patients/", {
            method: "GET",
        });

        dataPatients = await patients.json();

        try {
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
            
        } catch (error) {
            console.log("No data")
            
        }

    } catch (error) {
        console.error("Error:", error);
    }


    if (dataDoctors.message) {
        dataDoctors = [
            {
                name: dataDoctors.message,
                specialty: dataDoctors.message
            }
        ]
    }


    if (dataPatients.message) {
        dataPatients = [
            {
                name: dataPatients.message,
                lastname: dataPatients.message
            }
        ]
    }
    if (bookingData.message ) {
        console.log(dataDoctors)
        content.innerHTML = `
        <div class="container mt-5">
            <h2 class="mb-4">Reservas</h2>
            <p>${bookingData.message}</p>
        </div>
    
        <div class="container mt-5">
            <h2 class="mb-4">Crear reserva</h2>
            <form id="bookingForm">
                <div class="form-group mt-4">
                    <label for="doctor">Doctor:</label>
                    <select type="text" class="form-control" id="doctor" required>
                        ${dataDoctors.map((doctor) => !doctor ? `<option value="${doctor.id}">${doctor.message}</option>` : `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`).join("")}
                    </select>
                </div>
                <div class="form-group mt-4">
                    <label for="patient">Paciente:</label>
                    <select type="text" class="form-control" id="patient" required>
                    ${dataPatients.map((patient) => !patient ? `<option value="${patient.id}">${patient.message}</option>` : `<option value="${patient.id}">${patient.name} - ${patient.lastname}</option>`).join("")}

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
            <button type="button" class="btn btn-primary" id="showTopButton">Top especialidades</button>
            <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top</button>
            <div id="topDoctorsTableContainer" style="display:none;">
                <h2 class="mb-4">Top especialidades</h2>
                <table class="table table-bordered" id="topDoctorsTable">
                </table>
            </div>
        </div>

        <div class="container mt-5">
            <button type="button" class="btn btn-primary" id="showVisitButton">Fecha con más visitas</button>
            <button type="button" class="btn btn-secondary" id="hideVisitButton" style="display:none;">Ocultar</button>
            <div id="topVisitTableContainer" style="display:none;">
                <h2 class="mb-4">Fecha con más visitas</h2>
                <table class="table table-bordered" id="topVisitTable">
        
                </table>
            </div>
        </div>
    </div>
        `;
    
    } else {
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
            <button type="button" class="btn btn-primary" id="showTopButton">Top especialidades</button>
            <button type="button" class="btn btn-secondary" id="hideTopButton" style="display:none;">Ocultar Top</button>
            <div id="topDoctorsTableContainer" style="display:none;">
                <h2 class="mb-4">Top especialidades</h2>
                <table class="table table-bordered" id="topDoctorsTable">
                </table>
            </div>
        </div>


        <div class="container mt-5">
            <button type="button" class="btn btn-primary" id="showVisitButton">Fecha con más visitas</button>
            <button type="button" class="btn btn-secondary" id="hideVisitButton" style="display:none;">Ocultar</button>
            <div id="topVisitTableContainer" style="display:none;">
                <h2 class="mb-4">Fecha con más visitas</h2>
                <table class="table table-bordered" id="topVisitTable">
        
                </table>
            </div>
        </div>
        `;

    }

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
         
        if (!selectedDoctor.available) {
            return alert("Doctor no disponible")
        }
    
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

    const showVisitButton = document.getElementById("showVisitButton");
    const hideVisitButton = document.getElementById("hideVisitButton");
    const topVisitTableContainer = document.getElementById("topVisitTableContainer");
    const topVisitTable = document.getElementById("topVisitTable");
    
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

    showVisitButton.addEventListener("click", async () => {
        try {
            const topVisitResponse = await fetch("http://127.0.0.1:8000/bookings/top-booking-date/", {
                method: "GET",
            });
    
            const topVisitsData = await topVisitResponse.json();
    
            topVisitTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Total visitas</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateVisitTableRows(topVisitsData)}
                </tbody>
            `;
    
            topVisitTableContainer.style.display = "block";
            showVisitButton.style.display = "none";
            hideVisitButton.style.display = "inline";
        } catch (error) {
            console.error("Error fetching top specialties:", error);
        }
    });
    
    hideTopButton.addEventListener("click", () => {
        topDoctorsTableContainer.style.display = "none";
        showTopButton.style.display = "inline";
        hideTopButton.style.display = "none";
    });


    hideVisitButton.addEventListener("click", () => {
        topVisitTableContainer.style.display = "none";
        showVisitButton.style.display = "inline";
        hideVisitButton.style.display = "none";
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


    const generateVisitTableRows = (topVisitData) => {
        console.log(topVisitData)
        if (topVisitData.message) {
            return `
            
            `

            
        } else{
            return `

            <tr>
            <td>${topVisitData.top_date}</td>
            <td>${topVisitData.total_visits}</td>
        </tr>
            
            
            `

        }
    };
};

fetchDataAndRender();
