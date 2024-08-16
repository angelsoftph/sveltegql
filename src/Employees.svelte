<script>
    import { Link, navigate } from 'svelte-routing';
    import { client } from './lib/graphql-client.js';
    import { onMount } from 'svelte';
    
    import { GET_EMPLOYEES, DELETE_EMPLOYEE } from './lib/queries.js';
  
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";

    import Toasts from "./Toasts.svelte";
    import { addToast, decodeToken, decodedToken } from "./store";
    
    import "./app.css";

    let employees = [];
    let userRole = '';

    async function fetchEmployees() {
        const data = await client.request(GET_EMPLOYEES);
        employees = data.employees;
    }

    async function deleteEmployee(id) {
        await client.request(DELETE_EMPLOYEE, { id });
        fetchEmployees();
    }

    async function handleLogout() {
        try {
            localStorage.removeItem('LM_AUTH_TOKEN');

            addToast({ message: "You have successfully logged out", type: "success", dismissible: true, timeout: 2000 });
            navigate('/');
        } catch (err) {
            addToast({ message: "Invalid credentials", type: "error", dismissible: true, timeout: 2000 });
        }
    }

    onMount(async () => {
        let auth_token = localStorage.getItem('LM_AUTH_TOKEN');

        if (!auth_token) {
            navigate("/");
        } else {
            decodeToken(auth_token);
            if (decodedToken) {
                userRole = decodedToken.role;
            }

            fetchEmployees();
        }
    });
</script>

<Toasts />

<main>
    <div class="container py-5">
        <div class="flex flex-col items-start">
            <div class="flex flex-row w-full justify-between">
                <div class="flex">
                    <h1 class="text-3xl text-emerald-700">Svelte Demo</h1>
                </div>
                <div class="flex">
                    <Button variant="destructive" on:click={handleLogout}>Log Out</Button>
                </div>
            </div>
        </div>
        <div class="flex flex-col mt-10 gap-5">
            <div class="flex flex-row justify-between">
                <div class="flex items-center">
                    <h3 class="text-xl">Employee List</h3>
                </div>
                <div class="flex flex-row items-center justify-end">
                    {#if userRole === 'A'}
                        <Link to="/employee"><Button>Add</Button></Link>
                    {/if}
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
                                <Table.Cell>{employee.street !== null ? employee.street : ''} {employee.city !== null ? employee.city : ''}</Table.Cell>
                                <Table.Cell>{employee.contact !== null ? employee.contact: ''}</Table.Cell>
                                <Table.Cell class="text-right">{employee.age}</Table.Cell>
                                <Table.Cell>{employee.tenure}</Table.Cell>
                                <Table.Cell>
                                    <div class="flex flex-row gap-2">
                                        <div>
                                            {#if userRole === 'A'}
                                                <Link to="/employee/{employee.id}"><Button variant="outline">Edit</Button></Link>
                                            {:else}
                                                <Link to="/employee/{employee.id}"><Button variant="outline">View</Button></Link>
                                            {/if}
                                        </div>
                                        {#if userRole === 'A'}
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
                                        {/if}
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
