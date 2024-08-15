<script>
    import { Router, Link, Route } from 'svelte-routing';
    import { client } from './lib/graphql-client.js';
    import { GET_EMPLOYEES, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from './lib/queries.js';
  
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Form from "$lib/components/ui/form";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    
    import Employee from './Employee.svelte';
    import "./app.css";

    let employees = [];
    let newEmployee =  {
        fname: '',
        lname: '',
        mname: '',
        bdate: '',
        gender: '',
        cstatus: '',
        position: '',
        datehired: '',
        age: 0,
        tenure: ''
    };

    async function fetchEmployees() {
        const data = await client.request(GET_EMPLOYEES);
        employees = data.employees;
    }
  
    async function addEmployee() {
        newEmployee = {
            fname: 'Harry',
            lname: 'Potter',
            mname: 'James',
            bdate: '1990-01-01',
            gender: 'M',
            cstatus: 'S',
            position: 'Developer',
            datehired: '2024-01-01',
            age: 34,
            tenure: '6m'
        };
        await client.request(CREATE_EMPLOYEE, newEmployee);

        newEmployee = {
            fname: '',
            lname: '',
            mname: '',
            bdate: '',
            gender: '',
            cstatus: '',
            position: '',
            datehired: '',
            age: 0,
            tenure: ''
        };

        fetchEmployees();
    }
    
    async function deleteEmployee(id) {
        await client.request(DELETE_EMPLOYEE, { id });
        fetchEmployees();
    }
  
    fetchEmployees();
</script>

<main>
    <div class="container py-5">
        <div class="flex flex-col items-start">
            <h1 class="text-3xl text-emerald-700">LegalMatch&reg;</h1>
        </div>
        <div class="flex flex-col mt-10 gap-5">
            <div class="flex flex-row justify-between">
                <div class="flex items-center">
                    <h3 class="text-xl">Employee List</h3>
                </div>
                <div class="flex flex-row items-center justify-end">
                    <Button on:click={addEmployee}>Add</Button>
                </div>
            </div>
            <div>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head class="w-[240px]">Name</Table.Head>
                            <Table.Head>Primary Address</Table.Head>
                            <Table.Head class="w-[150px]">Primary Contact</Table.Head>
                            <Table.Head class="text-right">Age</Table.Head>
                            <Table.Head class="w-[100px]">Tenure</Table.Head>
                            <Table.Head>Action</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each employees as employee}
                            <Table.Row>
                                <Table.Cell class="font-medium">{employee.fname} {employee.lname}</Table.Cell>
                                <Table.Cell>{employee.street}, {employee.city}</Table.Cell>
                                <Table.Cell>{employee.contact}</Table.Cell>
                                <Table.Cell class="text-right">{employee.age}</Table.Cell>
                                <Table.Cell>{employee.tenure}</Table.Cell>
                                <Table.Cell>
                                    <div class="flex flex-row gap-2">
                                        <div>
                                            <Link to="/employee/{employee.id}"><Button variant="outline">Edit</Button></Link>
                                        </div>
                                        <div>
                                            <AlertDialog.Root>
                                                <AlertDialog.Trigger asChild let:builder>
                                                    <Button builders={[builder]} variant="outline">Delete</Button>
                                                </AlertDialog.Trigger>
                                                <AlertDialog.Content>
                                                    <AlertDialog.Header>
                                                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                                                        <AlertDialog.Description>
                                                        This action cannot be undone. This will permanently delete the selected employee record.
                                                        </AlertDialog.Description>
                                                    </AlertDialog.Header>
                                                    <AlertDialog.Footer>
                                                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                                                        <AlertDialog.Action variant="ghost" on:click={() => deleteEmployee(employee.id)}>Confirm</AlertDialog.Action>
                                                    </AlertDialog.Footer>
                                                </AlertDialog.Content>
                                            </AlertDialog.Root>
                                        </div>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>
        </div>
    </div>
</main>
