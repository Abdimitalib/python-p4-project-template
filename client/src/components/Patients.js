import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const PatientSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  age: Yup.number().required('Required').positive().integer(),
  gender: Yup.string().required('Required')
});

function Patients() {
  const [patients, setPatients] = useState([]);
  
  useEffect(() => {
    fetch('/patients')
      .then(res => res.json())
      .then(data => setPatients(data));
  }, []);
  
  const handleSubmit = (values, { resetForm }) => {
    fetch('/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(data => {
      setPatients([...patients, data]);
      resetForm();
    });
  };
  
  const handleDelete = (id) => {
    fetch(`/patients/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setPatients(patients.filter(patient => patient.id !== id));
      });
  };
  
  return (
    <div>
      <h1>Patients</h1>
      
      <Formik
        initialValues={{ name: '', age: '', gender: '' }}
        validationSchema={PatientSchema}
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
              <label>Age</label>
              <Field name="age" type="number" />
              {errors.age && touched.age ? <div>{errors.age}</div> : null}
            </div>
            <div>
              <label>Gender</label>
              <Field name="gender" />
              {errors.gender && touched.gender ? <div>{errors.gender}</div> : null}
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            {patient.name} - {patient.age} - {patient.gender}
            <button onClick={() => handleDelete(patient.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Patients;