<script>
    import { Link, navigate } from 'svelte-routing';
    import { client } from './lib/graphql-client.js';
    import { onMount } from 'svelte';
    
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Select from "$lib/components/ui/select";
    import Button from '$lib/components/ui/button/button.svelte';
    import { Input } from "$lib/components/ui/input";
    
    import Toasts from "./Toasts.svelte";
    import { addToast } from "./store";
        
    import {
        GET_EMPLOYEE,
        UPDATE_EMPLOYEE,
        DELETE_EMPLOYEE,
        GET_ADDRESSES,
        GET_CONTACTS,
        CREATE_ADDRESS,
        UPDATE_ADDRESS,
        DELETE_ADDRESS,
        SET_PRIMARY_ADDRESS,
        CREATE_CONTACT,
        UPDATE_CONTACT,
        DELETE_CONTACT,
        SET_PRIMARY_CONTACT
    } from './lib/queries.js';
    import "./app.css";
        
    export let id;
    let employee = {};
    let addresses = [];
    let contacts = [];
    let newAddress = {
        employee_id: '',
        street: '',
        city: '',
        is_primary: 0
    }
    let newContact = {
        employee_id: '',
        contact: '',
        is_primary: 0
    }
    let editAddress = null;
    let editContact = null;
    let primaryAddress = null;
    let primaryContact = null;

    let showNewAddressForm = false;
    let showNewContactForm = false;

    function handleNewAddress() {
        showNewAddressForm = true;
    }

    function handleNewContact() {
        showNewContactForm = true;
    }

    async function fetchEmployee() {
        const data = await client.request(GET_EMPLOYEE, { id });
        employee = data.employee;
    }

    async function fetchAddresses() {
        let employee_id = id;
        const data = await client.request(GET_ADDRESSES, { employee_id });
        addresses = data.addresses;
    }

    async function fetchContacts() {
        let employee_id = id;
        const data = await client.request(GET_CONTACTS, { employee_id });
        contacts = data.contacts;
    }

    async function updateEmployee() {
        // toast('Event has been created', {
	    //     duration: 10000
        // });
        employee.id = id;
        await client.request(UPDATE_EMPLOYEE, employee);



        if (showNewAddressForm) {
            await addAddress();
        }
        if (showNewContactForm) {
            await addContact();
        }

        fetchEmployee();
    }

    async function deleteEmployee() {
        await client.request(DELETE_EMPLOYEE, { id });
        navigate('/');
    }

    async function addContact() {
        let employee_id = id;
        newContact = {
            ...newContact,
            employee_id: employee_id,
            // we have to make sure is_primary is a number, not a string
            is_primary: Number(newContact.is_primary)
        };
        await client.request(CREATE_CONTACT, newContact);
    }

    async function addAddress() {
        let employee_id = id;
        newAddress = {
            ...newAddress,
            employee_id: employee_id,
            // we have to make sure is_primary is a number, not a string
            is_primary: Number(newAddress.is_primary)
        };
        await client.request(CREATE_ADDRESS, newAddress);
    }

    async function updateAddress(id) {
        await client.request(CREATE_ADDRESS, editAddress);
    }

    async function setPrimaryAddress(address_id) {
        let employee_id = id;
        await client.request(SET_PRIMARY_ADDRESS, { id: address_id, employee_id: employee_id });
        await fetchAddresses();

        let message = "Primary address has been changed";
        let type = "success";
        let dismissible = true;
        let timeout = 1000;
        addToast({ message, type: "success", dismissible, timeout });
    }

    async function setPrimaryContact(contact_id) {
        let employee_id = id;
        await client.request(SET_PRIMARY_CONTACT, { id: contact_id, employee_id: employee_id });
        await fetchContacts();

        let message = "Primary contact has been changed";
        let type = "success";
        let dismissible = true;
        let timeout = 1000;
        addToast({ message, type: "success", dismissible, timeout });
    }

    let selectedGender = { value: 'M', label: 'Male'  }
    let selectedStatus = { value: 'S', label: 'Single' }
    let genderOptions = [];
    let statusOptions = [];

    onMount(async () => {
        await fetchEmployee();
        await fetchAddresses();
        await fetchContacts();

        if (employee.gender === 'F') {
            selectedGender = { value: 'F', label: 'Female' }
        }
        switch (employee.cstatus) {
            case 'M':
                selectedGender = { value: 'M', label: 'Married' }
                break;
            case 'D':
                selectedGender = { value: 'D', label: 'Divorced' }
                break;
        }

        genderOptions = [
            { value: "M", label: "Male" },
            { value: "F", label: "Female" }
        ];

        statusOptions = [
            { value: "S", label: "Single" },
            { value: "M", label: "Married" },
            { value: "D", label: "Divorced" }
        ];
    });
</script>

<Toasts />

<main>
    <div class="container py-5">
        <div class="flex flex-col items-start">
            <h1 class="text-3xl text-emerald-700">Svelte Demo</h1>
        </div>
        <div class="flex flex-col mt-10">
            <div class="flex flex-row justify-between">
                <div class="flex items-center">
                    <h3 class="text-xl">Employee Info</h3>
                </div>
                <div class="flex flex-row items-center gap-3">
                    <div>
                        <Button on:click={updateEmployee}>Update</Button>
                    </div>
                    <div>
                        <AlertDialog.Root>
                            <AlertDialog.Trigger asChild let:builder>
                                <Button builders={[builder]} variant="destructive">Delete</Button>
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
                                    <AlertDialog.Action variant="ghost" on:click={deleteEmployee}>Confirm</AlertDialog.Action>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                    </div>
                </div>
            </div>
            <hr class="mt-2 mb-5" />
            <div class="flex flex-row gap-5">
                <div class="flex flex-row w-1/3">
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">First Name</div>
                            <div><Input name="first_name" bind:value={employee.fname} /></div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Last Name</div>
                            <div><Input name="last_name" bind:value={employee.lname} /></div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Middle Name</div>
                            <div><Input name="middle_name" bind:value={employee.mname} /></div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Birth Date</div>
                            <div><Input name="birth_date" bind:value={employee.bdate} placeholder="yyyy-mm-dd" /></div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Gender</div>
                            <div>
                                <Select.Root portal={null} bind:selected={selectedGender}>
                                    <Select.Trigger class="w-[216px]">
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Group>
                                            {#each genderOptions as option}
                                                <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
                                            {/each}
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Marital Status</div>
                            <div>
                                <Select.Root portal={null} bind:selected={selectedStatus}>
                                    <Select.Trigger class="w-[216px]">
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Group>
                                            {#each statusOptions as option}
                                                <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
                                            {/each}
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Position</div>
                            <div><Input name="position" bind:value={employee.position} /></div>
                        </div>
                        <div class="flex flex-row items-center gap-3">
                            <div class="w-1/3">Date Hired</div>
                            <div><Input name="date_hired" bind:value={employee.datehired} /></div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-2/3 gap-10">
                    <div class="flex flex-col">
                        <div class="flex flex-row items-center justify-between">
                            <div><h4>Contact Info</h4></div>
                            <div><Button variant="ghost" id="btn-add-contact" title="Add contact" on:click={handleNewContact}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></Button></div>
                        </div>
                        <div class="mt-3">
                            <hr />
                        </div>
                        <div class="flex flex-col mt-3 gap-2">
                            <div class="flex flex-row items-center gap-3">
                                <div class="w-[200px]">Number</div>
                                <div>Primary?</div>
                            </div>
                            {#each contacts as contact}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="contact" value={contact.contact} readonly={true} /></div>
                                    <div class="w-[30px]">
                                        <input
                                            type="checkbox"
                                            name="primary_contact"
                                            checked={contact.is_primary}
                                            value={contact.id}
                                            on:click={() => setPrimaryContact(contact.id)}
                                        />
                                    </div>
                                    <div class="delete-contact" title="Delete Contact">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                    </div>
                                </div>
                            {/each}
                            {#if showNewContactForm}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="contact" bind:value={newContact.contact} /></div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="primary_address"
                                            bind:value={newContact.is_primary}
                                        />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex flex-row items-center justify-between">
                            <div><h4>Address Info</h4></div>
                            <div><Button variant="ghost" id="btn-add-address" title="Add address" on:click={handleNewAddress}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></Button></div>
                        </div>
                        <div class="mt-3">
                            <hr />
                        </div>
                        <div class="flex flex-col mt-3 gap-2">
                            <div class="flex flex-row items-center gap-3">
                                <div class="w-[200px]">Street</div>
                                <div class="w-[200px]">City</div>
                                <div>Primary?</div>
                            </div>
                            {#each addresses as address}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="street" value={address.street} readonly={true} /></div>
                                    <div class="w-[200px]"><Input name="city" value={address.city} readonly={true} /></div>
                                    <div class="w-[30px]">
                                        <input
                                            type="checkbox"
                                            name="primary_address"
                                            checked={address.is_primary}
                                            value={address.id}
                                            on:click={() => setPrimaryAddress(address.id)}
                                        />
                                    </div>
                                    <div class="delete-address" title="Delete Address">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                    </div>
                                </div>
                            {/each}
                            {#if showNewAddressForm}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="street" bind:value={newAddress.street} /></div>
                                    <div class="w-[200px]"><Input name="city" bind:value={newAddress.city} /></div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="primary_address"
                                            bind:value={newAddress.is_primary}
                                        />
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex mt-16 items-center justify-center">
                <Link to="/"><Button>Back to Employee List</Button></Link>
            </div>
        </div>
    </div>
</main>