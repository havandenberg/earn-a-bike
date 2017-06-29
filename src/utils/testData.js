import moment from 'moment';

export const testStore = {
  info: {
    nextId: 3
  },
  users: [
    {
      address: {
        city: 'Worcester',
        state: 'MA',
        streetLine1: '4 King St',
        streetLine2: '',
        zip: '01609'
      },
      dateOfBirth: {
        day: '1',
        month: '1',
        year: '1999'
      },
      email: 'manager',
      firstName: 'Manager',
      id: 0,
      isActive: false,
      isManager: true,
      lastName: '1',
      pin: '1234',
      phone: '111-222-3333'
    },
    {
      address: {
        city: 'Worcester',
        state: 'NY',
        streetLine1: '19 Lancaster St',
        streetLine2: 'Apt 3',
        zip: '01609'
      },
      dateOfBirth: {
        day: '03',
        month: '11',
        year: '1992'
      },
      email: 'hv',
      firstName: 'Halsey',
      id: 1,
      isActive: false,
      isManager: false,
      lastName: 'Vandenberg',
      parentName: 'Fred Vandenberg',
      parentPhone: '9142611943',
      pin: '1234',
      phone: '9147032060',
      visits: [{
        timeIn: moment().subtract(3, 'days').unix(),
        timeOut: moment().subtract(3, 'days').add(60 * 9, 'minutes').unix(),
        hours: 9,
        notes: 'Second day.'
      }, {
        timeIn: moment().subtract(10, 'days').unix(),
        timeOut: moment().subtract(10, 'days').add(60 * 2, 'minutes').unix(),
        hours: 2,
        notes: 'First Day!'
      }]
    },
    {
      address: {
        city: 'Worcester',
        state: 'NY',
        streetLine1: '19 Lancaster St',
        streetLine2: 'Apt 3',
        zip: '01609'
      },
      dateOfBirth: {
        day: '11',
        month: '01',
        year: '1994'
      },
      email: 'ah',
      firstName: 'Alexander',
      id: 2,
      isActive: false,
      isManager: false,
      lastName: 'Hackathorn',
      parentName: '',
      parentPhone: '',
      pin: '3456',
      phone: '9147032060',
      visits: [{
        timeIn: moment().subtract(2, 'days').unix(),
        timeOut: moment().subtract(2, 'days').add(60 * 1, 'minutes').unix(),
        hours: 1,
        notes: 'I did a lot today.'
      }, {
        timeIn: moment().subtract(7, 'days').unix(),
        timeOut: moment().subtract(7, 'days').add(60 * 4.5, 'minutes').unix(),
        hours: 4.5,
        notes: 'Today was my first day.'
      }]
    }
  ]
};
