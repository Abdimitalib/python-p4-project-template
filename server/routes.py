# backend/routes.py
from flask import Flask, request, jsonify
from models import db, Patient, Doctor, Appointment

app = Flask(__name__)

@app.route('/patients', methods=['GET', 'POST'])
def handle_patients():
    if request.method == 'POST':
        data = request.json
        new_patient = Patient(name=data['name'], age=data['age'], gender=data['gender'])
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({'message': 'Patient created successfully'}), 201
    else:
        patients = Patient.query.all()
        return jsonify([patient.to_dict() for patient in patients])

@app.route('/patients/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_patient(id):
    patient = Patient.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(patient.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        patient.name = data.get('name', patient.name)
        patient.age = data.get('age', patient.age)
        patient.gender = data.get('gender', patient.gender)
        db.session.commit()
        return jsonify({'message': 'Patient updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'message': 'Patient deleted successfully'})

@app.route('/doctors', methods=['GET', 'POST'])
def handle_doctors():
    if request.method == 'POST':
        data = request.json
        new_doctor = Doctor(name=data['name'], specialization=data['specialization'])
        db.session.add(new_doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor created successfully'}), 201
    else:
        doctors = Doctor.query.all()
        return jsonify([doctor.to_dict() for doctor in doctors])

@app.route('/doctors/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(doctor.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        doctor.name = data.get('name', doctor.name)
        doctor.specialization = data.get('specialization', doctor.specialization)
        db.session.commit()
        return jsonify({'message': 'Doctor updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor deleted successfully'})

@app.route('/appointments', methods=['GET', 'POST'])
def handle_appointments():
    if request.method == 'POST':
        data = request.json
        new_appointment = Appointment(date=data['date'], time=data['time'], patient_id=data['patient_id'], doctor_id=data['doctor_id'], description=data.get('description'))
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment created successfully'}), 201
    else:
        appointments = Appointment.query.all()
        return jsonify([appointment.to_dict() for appointment in appointments])

@app.route('/appointments/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify(appointment.to_dict())
    
    elif request.method == 'PUT':
        data = request.json
        appointment.date = data.get('date', appointment.date)
        appointment.time = data.get('time', appointment.time)
        appointment.description = data.get('description', appointment.description)
        db.session.commit()
        return jsonify({'message': 'Appointment updated successfully'})
    
    elif request.method == 'DELETE':
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)