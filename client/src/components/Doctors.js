import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const DoctorSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  specialization: Yup.string().required('Required')
});

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    fetch('/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, []);
  
  const handleSubmit = (values, { resetForm }) => {
    fetch('/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(data => {
      setDoctors([...doctors, data]);
      resetForm();
    });
  };
  
  const handleDelete = (id) => {
    fetch(`/doctors/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setDoctors(doctors.filter(doctor => doctor.id !== id));
      });
  };
  
  return (
    <div>
      <h1>Doctors</h1>
      
      <Formik
        initialValues={{ name: '', specialization: '' }}
        validationSchema={DoctorSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <label>Name</label>
              <Field name="name" />
              {errors.name && touched.name ? <div>{errors.name}</div> : null}
            </div>
            <div>
              <label>Specialization</label>
              <Field name="specialization" />
              {errors.specialization && touched.specialization ? <div>{errors.specialization}</div> : null}
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.id}>
            {doctor.name} - {doctor.specialization}
            <button onClick={() => handleDelete(doctor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;