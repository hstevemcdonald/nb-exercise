
const doctors = {
    "172bcok72khzgd": {
        "id": "172bcok72khzgd",
        "firstName": "John",
        "lastName": "Jones",
        "appointments": {}
    }
};

// const Joi = require('@hapi/joi');
const uniqid = require('uniqid');
const moment = require('moment');
const { MAX_APPOINTMENT_COUNT, APPOINTMENT_TYPE_NEW, APPOINTMENT_TYPE_FOLLOW_UP, DATETIME_FORMAT, MINUTE_INCREMENTS } = require('../constants');

module.exports = {

    // get all doctors
    getAll: function() {
        return Object.values(doctors);
    },

    // get list of appointments by doctor and day
    getAppointmentsByDay: function({ doctorId, dateTime }) {
        const matchDateFormat = 'MM-DD-YYYY';
        const matchDate = moment(dateTime, matchDateFormat);
        const appointmentKeys = Object.keys(doctors[doctorId].appointments).filter(dateTime => {
            return moment(dateTime, matchDateFormat) === matchDate;
        })
        return appointmentKeys.reduce((allAppointments, appointmentTime) => {
            return allAppointments.concat(doctors[doctorId].appointments[appointmentTime]);
        }, []);
    },

    // add doctor
    add: function( { firstName, lastName} ) {
        const newDoctor = {
            id: uniqid(),
            firstName, 
            lastName,
            appointments: {}
        };
        doctors[newDoctor.id] = newDoctor;
        return newDoctor;
    },

    // add appointment for a doctor
    addAppointment: function( { doctorId, patentFirstName, patientLastName, dateTime, kind = APPOINTMENT_TYPE_NEW } ) {
        if (!_isValidTime(dateTime)) {
            throw new Error('Time must start in 15 minute interval.')
        }
        if (!_isValidKind(kind)) {
            throw new Error(`Kind of appointment should be equal to ${APPOINTMENT_TYPE_NEW} or ${APPOINTMENT_TYPE_FOLLOW_UP}`);
        }
        if (!_isAvailable( { doctorId, dateTime} )) {
            throw new Error('Doctor is fully booked!');
        }
        const newAppointment = {
            id: uniqid(),
            doctorId, 
            dateTime, 
            patentFirstName,
            patientLastName,
            kind
        }
        const unix = moment(dateTime, DATETIME_FORMAT).format('x');
        if (!doctors[doctorId].appointments[unix]) {
            doctors[doctorId].appointments[unix] = [];
        }
        doctors[doctorId].appointments[unix].push(newAppointment);
        return newAppointment;
    }

}

// check if doctor is available for a given time 
function _isAvailable ( { doctorId, dateTime } ) {
    const unix = moment(dateTime, DATETIME_FORMAT).format('x');
    if (
        doctors[doctorId] && 
        doctors[doctorId].appointments[unix] && 
        doctors[doctorId].appointments[unix].length === MAX_APPOINTMENT_COUNT
    ) { 
        return false;
    }
    return true;
}

// check if a time is one of the valid minute increments
function _isValidTime(dateTime) {
    const min = Number(moment(dateTime, DATETIME_FORMAT).min());
    return MINUTE_INCREMENTS.includes(min);
}

// check if appointment 'kind'' is valid
function _isValidKind(kind) {
    return kind === APPOINTMENT_TYPE_NEW || kind === APPOINTMENT_TYPE_FOLLOW_UP;
}