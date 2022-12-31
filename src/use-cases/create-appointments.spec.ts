import { InMemoryAppointmentRepository } from './../repositories/in-memory/in-memory-appointments-repository';
import { AppointmentsRepository } from './../repositories/appointments-repository';
import { Appointment } from './../entities/appointment';
import { CreateAppointment } from './create-appointment';
import { describe, expect, it } from "vitest";
import { getFutureDate } from '../tests/utils/get-future-date';

describe('Create Appointment', ()=> {
    it('should be able to create an appointment', ()=> {

        const apRepository = new InMemoryAppointmentRepository()

        const createAppointment  = new CreateAppointment(
            apRepository
        )

        const startsAt = getFutureDate('2022-12-29')
        const endsAt = getFutureDate('2022-12-30')
    

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })

    it('should not be able to create an appointment with overlappingDates', async ()=> {


        const startsAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-15')

        const apRepository = new InMemoryAppointmentRepository()

        const createAppointment  = new CreateAppointment(
            apRepository
        )

       
        await createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-14'),
            endsAt: getFutureDate('2022-08-18')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-12')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-17')
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-11'),
            endsAt: getFutureDate('2022-08-12')
        })).rejects.toBeInstanceOf(Error)
    })
})