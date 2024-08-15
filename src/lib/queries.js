export const GET_EMPLOYEES = `
    query GetEmployees {
        employees {
            id
            fname
            lname
            street
            city
            contact
            age
            tenure
        }
    }
`;

export const GET_EMPLOYEE = `
    query GetEmployee($id: ID!) {
        employee(id: $id) {
            fname
            lname
            mname
            bdate
            gender
            cstatus
            position
            datehired
            age
            tenure
        }
    }
`;

export const CREATE_EMPLOYEE = `
    mutation CreateEmployee($fname: String!, $lname: String!, $mname: String!, $bdate: String!, $gender: String!, $cstatus: String!, $position: String!, $datehired: String!, $age: Int!, $tenure: String!) {
        createEmployee(fname: $fname, lname: $lname, mname: $mname, bdate: $bdate, gender: $gender, cstatus: $cstatus, position: $position, datehired: $datehired, age: $age, tenure: $tenure) {
            id
            fname
            lname
            mname
            bdate
            gender
            cstatus
            position
            datehired
            age
            tenure
        }
    }
`;

export const UPDATE_EMPLOYEE = `
    mutation UpdateEmployee($id: ID!, $fname: String!, $lname: String!, $mname: String!, $bdate: String!, $gender: String!, $cstatus: String!, $position: String!, $datehired: String!, $age: Int!, $tenure: String!) {
        updateEmployee(id: $id, fname: $fname, lname: $lname, mname: $mname, bdate: $bdate, gender: $gender, cstatus: $cstatus, position: $position, datehired: $datehired, age: $age, tenure: $tenure) {
            id
            fname
            lname
            mname
            bdate
            gender
            cstatus
            position
            datehired
            age
            tenure
        }
    }
`;

export const DELETE_EMPLOYEE = `
    mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
    }
`;

export const GET_ADDRESSES = `
    query getAddresses($employee_id: ID!) {
        addresses(employee_id: $employee_id) {
            id
            street
            city
            is_primary
        }
    }
`;

export const CREATE_ADDRESS = `
    mutation CreateAddress($employee_id: Int!, $street: String!, $city: String!, $is_primary: Boolean!) {
        createAddress(employee_id: $employee_id, street: $street, city: $city, is_primary: $is_primary) {
            id
            employee_id
            street
            city
            is_primary
        }
    }
`;

export const UPDATE_ADDRESS = `
    mutation UpdateAddress($id: ID!, $street: String!, $city: String!, $is_primary: Boolean!) {
        updateEmployee(id: $id, street: $street , city: $city, is_primary: $is_primary) {
            id
            street
            city
            is_primary
        }
    }
`;

export const DELETE_ADDRESS = `
    mutation DeleteAddress($id: ID!) {
        deleteAddress(id: $id)
    }
`;

export const GET_CONTACTS = `
    query getContacts($employee_id: ID!) {
        contacts(employee_id: $employee_id) {
            id
            contact
            is_primary
        }
    }
`;

export const CREATE_CONTACT = `
    mutation CreateContact($employee_id: Int!, $contact: String!, $is_primary: Boolean!) {
        createContact(employee_id: $employee_id, contact: $contact, is_primary: $is_primary) {
            id
            employee_id
            contact
            is_primary
        }
    }
`;

export const UPDATE_CONTACT = `
    mutation UpdateContact($id: ID!, $contact: String!, $is_primary: Boolean!) {
        updateEmployee(id: $id, contact: $contact, is_primary: $is_primary) {
            id
            contact
            is_primary
        }
    }
`;

export const DELETE_CONTACT = `
    mutation DeleteContact($id: ID!) {
        deleteContact(id: $id)
    }
`;
