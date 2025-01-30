from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hospital.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    appointments = db.relationship('Appointment', backref='patient', lazy=True)

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)
    appointments = db.relationship('Appointment', backref='doctor', lazy=True)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(100), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    notes = db.Column(db.String(200))

@app.route('/patients', methods=['GET', 'POST'])
def handle_patients():
    if request.method == 'POST':
        data = request.get_json()
        new_patient = Patient(name=data['name'], age=data['age'])
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({'id': new_patient.id, 'name': new_patient.name, 'age': new_patient.age}), 201

    patients = Patient.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'age': p.age} for p in patients])

@app.route('/patients/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_patient(id):
    patient = Patient.query.get_or_404(id)
    
    if request.method == 'GET':
        return jsonify({'id': patient.id, 'name': patient.name, 'age': patient.age})

    elif request.method == 'PUT':
        data = request.get_json()
        patient.name = data['name']
        patient.age = data['age']
        db.session.commit()
        return jsonify({'id': patient.id, 'name': patient.name, 'age': patient.age})

    elif request.method == 'DELETE':
        db.session.delete(patient)
        db.session.commit()
        return '', 204

if __name__ == '__main__':
    app.run(debug=True)