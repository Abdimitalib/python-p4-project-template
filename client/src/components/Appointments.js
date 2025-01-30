import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AppointmentSchema = Yup.object().shape({
  date: Yup.string().required('Required'),
  time: Yup.string().required('Required'),
  patient_id: Yup.number().required('Required').positive().integer(),
  doctor_id: Yup.number().required('Required').positive().integer(),
  description: Yup.string()
});

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    fetch('/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);
  
  const handleSubmit = (values, { resetForm }) => {
    fetch('/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(data => {
      setAppointments([...appointments, data]);
      resetForm();
    });
  };
  
  const handleDelete = (id) => {
    fetch(`/appointments/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setAppointments(appointments.filter(appointment => appointment.id !== id));
      });
  };
  
  return (
    <div>
      <h1>Appointments</h1>
      
      <Formik
        initialValues={{ date: '', time: '', patient_id: '', doctor_id: '', description: '' }}
        validationSchema={AppointmentSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <label>Date</label>
              <Field name="date" />
              {errors.date && touched.date ? <div>{errors.date}</div> : null}
            </div>
            <div>
              <label>Time</label>
              <Field name="time" />
              {errors.time && touched.time ? <div>{errors.time}</div> : null}
            </div>
            <div>
              <label>Patient ID</label>
              <Field name="patient_id" type="number" />
              {errors.patient_id && touched.patient_id ? <div>{errors.patient_id}</div> : null}
            </div>
            <div>
              <label>Doctor ID</label>
              <Field name="doctor_id" type="number" />
              {errors.doctor_id && touched.doctor_id ? <div>{errors.doctor_id}</div> : null}
            </div>
            <div>
              <label>Description</label>
              <Field name="description" />
              {errors.description && touched.description ? <div>{errors.description}</div> : null}
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            {appointment.date} - {appointment.time} - Patient: {appointment.patient_id} - Doctor: {appointment.doctor_id}
            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;