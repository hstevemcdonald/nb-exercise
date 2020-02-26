const express = require('express');
const router = express.Router();
const doctor = require('../components/doctor');

// get all doctors
router.get('/doctors', function(req, res, next) {
    try {
        const allDoctors = doctor.getAll();
        res.json(allDoctors);
    } catch (error) {
        next(error);
    }
});

// create new doctors
router.post('/doctors', function(req, res, next) {
    try {
        const newDoctor = doctor.add(req.body);
        res.json(newDoctor);
    } catch (error) {
        next(error);
    }
});

// create new doctor appointment
router.post('/doctors/:id/appointment', function(req, res, next) {
    try {
        const newAppointment = doctor.addAppointment({ doctorId: id, ...req.body });
        res.json(newAppointment);
    } catch (error) {
        next(error);
    }
});

// delete a doctor's appointment
router.delete('/doctors/:id/appointment/:appointmentId', function(req, res, next) {
    try {
        const id = req.params.id;
        const appointmentId = req.params.appointmentId;
        const status = doctor.deleteAppointment( { id, appointmentId });
        res.json({status});
    } catch (error) {
        next(error);
    }
});

// get all appoinemtnes for a doctor by day
router.get('/doctors/:id/appointmentsbyday/:day', function(req, res, next) {
    try {
        const id = req.params.id;
        const day = req.params.day;
        const appointments = doctor.getAppointmentsByDay( { id, day });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
