<script>
    import { Link, navigate } from 'svelte-routing';
    import { client } from './lib/graphql-client.js';
    import { onMount } from 'svelte';

    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Select from "$lib/components/ui/select";
    import Button from '$lib/components/ui/button/button.svelte';
    import { Input } from "$lib/components/ui/input";
    import { datePicker } from 'svelte-flatpickr-plus';
    import Toasts from "./Toasts.svelte";
    import { addToast, decodeToken, decodedToken } from "./store";

    import {
        GET_EMPLOYEE,
        CREATE_EMPLOYEE,
        UPDATE_EMPLOYEE,
        DELETE_EMPLOYEE,
        DELETE_EMPLOYEE_ADDRESSES,
        DELETE_EMPLOYEE_CONTACTS,
        GET_ADDRESSES,
        GET_CONTACTS,
        CREATE_ADDRESS,
        DELETE_ADDRESS,
        SET_PRIMARY_ADDRESS,
        CREATE_CONTACT,
        DELETE_CONTACT,
        SET_PRIMARY_CONTACT
    } from './lib/queries.js';
    import "./app.css";

    export let id = null;
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
    let showNewAddressForm = false;
    let showNewContactForm = false;
    let userRole = '';

    function handleNewAddress() {
        showNewAddressForm = true;
    }

    function handleNewContact() {
        showNewContactForm = true;
    }

    async function fetchEmployee() {
        const data = await client.request(GET_EMPLOYEE, { id });

        if (data && data.employee) {
            employee = data.employee;
        } else {
            addToast({ message: "Employee record not found", type: "error", dismissible: true, timeout: 2000 });
            navigate("/employees");
        }
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

    async function createEmployee() {
        employee = {
            fname: fname,
            lname: lname,
            mname: mname,
            bdate: bdate,
            position: position,
            datehired: datehired,
            gender: selectedGender.value,
            cstatus: selectedStatus.value
        };

        const result = await client.request(CREATE_EMPLOYEE, employee);
        addToast({ message: "Employee record has been created", type: "success", dismissible: true, timeout: 2000 });

        // get id of the newly created record
        id = result.createEmployee.id;

        if (showNewAddressForm && newAddress.street && newAddress.city) {
            await addAddress();
            addToast({ message: "New address has been added", type: "success", dismissible: true, timeout: 2000 });
            showNewAddressForm = false;
            newAddress = {
                employee_id: '',
                street: '',
                city: '',
                is_primary: 0
            }
            await fetchAddresses();
        }
        if (showNewContactForm && newContact.contact) {
            await addContact();
            addToast({ message: "New contact has been added", type: "success", dismissible: true, timeout: 2000 });
            showNewContactForm = false;
            newContact = {
                employee_id: '',
                contact: '',
                is_primary: 0
            }
            await fetchContacts();
        }
    }

    async function updateEmployee() {
        employee.id = id;
        employee = {
            id: id,
            fname: fname,
            lname: lname,
            mname: mname,
            bdate: bdate,
            position: position,
            datehired: datehired,
            gender: selectedGender.value,
            cstatus: selectedStatus.value
        }

        await client.request(UPDATE_EMPLOYEE, employee);
        addToast({ message: "Employee record has been updated", type: "success", dismissible: true, timeout: 2000 });

        if (showNewAddressForm && newAddress.street && newAddress.city) {
            await addAddress();
            addToast({ message: "New address has been added", type: "success", dismissible: true, timeout: 2000 });
            showNewAddressForm = false;
            newAddress = {
                employee_id: '',
                street: '',
                city: '',
                is_primary: 0
            }
        }
        if (showNewContactForm && newContact.contact) {
            await addContact();
            addToast({ message: "New contact has been added", type: "success", dismissible: true, timeout: 2000 });
            showNewContactForm = false;
            newContact = {
                employee_id: '',
                contact: '',
                is_primary: 0
            }
        }

        await fetchEmployee();
        await fetchAddresses();
        await fetchContacts();
    }

    async function deleteEmployee() {
        let employee_id = id;
        await client.request(DELETE_EMPLOYEE, { id });
        await client.request(DELETE_EMPLOYEE_ADDRESSES, { employee_id });
        await client.request(DELETE_EMPLOYEE_CONTACTS, { employee_id });

        addToast({ message: "Employee record successfully deleted", type: "success", dismissible: true, timeout: 2000 });
        navigate('/');
    }

    async function addContact() {
        let employee_id = id;
        let is_primary = 1;

        // set this new contact as the primary contact
        // if the employee has no other contacts
        if (contacts.length >= 1) {
            is_primary = 0;
        }

        newContact = {
            ...newContact,
            employee_id: employee_id,
            is_primary: Number(is_primary)
        };
        await client.request(CREATE_CONTACT, newContact);
    }

    async function addAddress() {
        let employee_id = id;
        let is_primary = 1;

        // set this new address as the primary address
        // if the employee has no other addresses
        if (addresses.length >= 1) {
            is_primary = 0;
        }

        newAddress = {
            ...newAddress,
            employee_id: employee_id,
            is_primary: Number(is_primary)
        };
        await client.request(CREATE_ADDRESS, newAddress);
    }

    async function setPrimaryAddress(address_id) {
        let employee_id = id;
        await client.request(SET_PRIMARY_ADDRESS, { id: address_id, employee_id: employee_id });
        await fetchAddresses();

        addToast({ message: "Primary address has been changed", type: "success", dismissible: true, timeout: 2000 });
    }

    async function setPrimaryContact(contact_id) {
        let employee_id = id;
        await client.request(SET_PRIMARY_CONTACT, { id: contact_id, employee_id: employee_id });
        await fetchContacts();

        addToast({ message: "Primary contact has been changed", type: "success", dismissible: true, timeout: 2000 });
    }

    async function deleteAddress(address_id) {
        await client.request(DELETE_ADDRESS, { id: address_id });
        await fetchAddresses();

        addToast({ message: "Selected address has been deleted", type: "success", dismissible: true, timeout: 2000 });
    }

    async function deleteContact(contact_id) {
        await client.request(DELETE_CONTACT, { id: contact_id });
        await fetchContacts();

        addToast({ message: "Selected contact has been deleted", type: "success", dismissible: true, timeout: 2000 });
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

    let selectedGender = { value: 'M', label: 'Male' }
    let selectedStatus = { value: 'S', label: 'Single' }
    let genderOptions = [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" }
    ];
    let statusOptions = [
        { value: "S", label: "Single" },
        { value: "M", label: "Married" },
        { value: "D", label: "Divorced" }
    ];

    let defaultOptionsBirthDate = {};
    let defaultOptionsDateHired = {};
    let isLoading = true;

    let fname = '';
    let lname = '';
    let mname = '';
    let bdate = '';
    let position = '';
    let datehired = '';

    onMount(async () => {
        let auth_token = localStorage.getItem('LM_AUTH_TOKEN');

        if (!auth_token) {
            navigate("/");
        } else {
            decodeToken(auth_token);
            if (decodedToken) {
                userRole = decodedToken.role;
            }

            if (id) {
                try {
                    await fetchEmployee();
                    await fetchAddresses();
                    await fetchContacts();

                    if (employee.gender === 'F') {
                        selectedGender = { value: 'F', label: 'Female' }
                    } else {
                        selectedGender = { value: 'M', label: 'Male' }
                    }
                    switch (employee.cstatus) {
                        case 'M':
                            selectedStatus = { value: 'M', label: 'Married' }
                            break;
                        case 'D':
                            selectedStatus = { value: 'D', label: 'Divorced' }
                            break;
                    }
                } catch(error) {
                    console.log('Error loading data: ', error);
                } finally {
                    isLoading = false;

                    defaultOptionsBirthDate = {
                        dateFormat: 'Y-m-d',
                        ariaDateFormat: 'Y-m-d',
                        defaultDate: employee.bdate
                    };
                    defaultOptionsDateHired = {
                        dateFormat: 'Y-m-d',
                        ariaDateFormat: 'Y-m-d',
                        defaultDate: employee.datehired
                    };

                    fname = employee.fname;
                    lname = employee.lname;
                    mname = employee.mname;
                    bdate = employee.bdate;
                    position = employee.position;
                    datehired = employee.datehired;
                }
            } else {
                isLoading = false;
            }
        }
    });

    function validateInput(mode) {
        if (fname.trim() === '') {
            alert('First Name cannot be empty!');
            return;
        }
        if (lname.trim() === '') {
            alert('Last Name cannot be empty!');
            return;
        }
        if (bdate.trim() === '') {
            alert('Birth Date cannot be empty!');
            return;
        }
        if (position.trim() === '') {
            alert('Position cannot be empty!');
            return;
        }
        if (datehired.trim() === '') {
            alert('Date Hired cannot be empty!');
            return;
        }

        if (mode === 'create') {
            createEmployee();
        } else {
            updateEmployee();
        }
    }
</script>

<Toasts />

{#if isLoading}
    <div class="flex flex-row justify-center mt-20">Loading data...</div>
{:else}
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
            <div class="flex flex-col mt-10">
                <div class="flex flex-row justify-between">
                    <div class="flex items-center">
                        <h3 class="text-xl">Employee Info</h3>
                    </div>
                    <div class="flex flex-row items-center gap-3">
                        {#if userRole === 'A'}
                            <div>
                                {#if id}
                                    <Button on:click={() => validateInput('update')}>Update</Button>
                                {:else}
                                    <Button on:click={() => validateInput('create')}>Create</Button>
                                {/if}
                            </div>
                            {#if id}
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
                            {/if}
                        {/if}
                    </div>
                </div>
                <hr class="mt-2 mb-5" />
                <div class="flex flex-row gap-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-10">
                        <div class="col-span-1">
                            <div class="flex flex-col gap-2">
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">First Name</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <Input name="first_name" bind:value={fname} />
                                        {:else}
                                            <Input name="first_name" bind:value={fname} readonly />
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Last Name</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <Input name="last_name" bind:value={lname} />
                                        {:else}
                                            <Input name="last_name" bind:value={lname} readonly />
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Middle Name</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <Input name="middle_name" bind:value={mname} />
                                        {:else}
                                            <Input name="middle_name" bind:value={mname} readonly />
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Birth Date</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <input class="datepicker" name="birth_date" use:datePicker={defaultOptionsBirthDate} bind:value={bdate} />
                                        {:else}
                                            <Input name="birth_date" bind:value={bdate} placeholder="yyyy-mm-dd" readonly />
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Gender</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
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
                                        {:else}
                                            <Select.Root portal={null} bind:selected={selectedGender} disabled>
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
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Marital Status</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
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
                                        {:else}
                                            <Select.Root portal={null} bind:selected={selectedStatus} disabled>
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
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Position</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <Input name="position" bind:value={position} />
                                        {:else}
                                            <Input name="position" bind:value={position} readonly />
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-1/3">Date Hired</div>
                                    <div class="w-2/3">
                                        {#if userRole === 'A'}
                                            <input class="datepicker" name="date_hired" use:datePicker={defaultOptionsDateHired} bind:value={datehired} />
                                        {:else}
                                            <Input name="date_hired" bind:value={datehired} readonly />
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-1 lg:col-span-2">
                            <div class="flex flex-col mb-10">
                                <div class="flex flex-row items-center justify-between">
                                    <div><h4>Contact Info</h4></div>
                                    <div>
                                        {#if userRole === 'A'}
                                            <Button variant="ghost" id="btn-add-contact" title="Add contact" on:click={handleNewContact}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></Button>
                                        {/if}
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <hr />
                                </div>
                                <div class="flex flex-col mt-3 gap-2">
                                    <div class="flex flex-row items-center gap-3">
                                        <div class="w-[200px]">Number</div>
                                        {#if id}
                                            <div>Primary?</div>
                                        {/if}
                                    </div>
                                    {#each contacts as contact}
                                        <div class="flex flex-row items-center gap-3">
                                            <div class="w-[200px]">
                                                <Input name="contact" value={contact.contact} readonly={true} />
                                            </div>
                                            <div class="w-[30px]">
                                                {#if userRole === 'A'}
                                                    <input
                                                        type="checkbox"
                                                        name="primary_contact"
                                                        checked={contact.is_primary}
                                                        value={contact.id}
                                                        on:click={() => setPrimaryContact(contact.id)}
                                                    />
                                                {:else}
                                                    <input
                                                        disabled
                                                        type="checkbox"
                                                        name="primary_contact"
                                                        checked={contact.is_primary}
                                                        value={contact.id}
                                                    />
                                                {/if}
                                            </div>
                                            {#if userRole === 'A'}
                                                <div class="delete-contact" title="Delete Contact">
                                                    <Button variant="ghost" on:click={() => deleteContact(contact.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                                    </Button>
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                    {#if showNewContactForm}
                                        <div class="flex flex-row items-center gap-3">
                                            <div class="w-[200px]"><Input name="contact" bind:value={newContact.contact} /></div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <div class="flex flex-row items-center justify-between">
                                    <div><h4>Address Info</h4></div>
                                    <div>
                                        {#if userRole === 'A'}
                                            <Button variant="ghost" id="btn-add-address" title="Add address" on:click={handleNewAddress}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></Button>
                                        {/if}
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <hr />
                                </div>
                                <div class="flex flex-col mt-3 gap-2">
                                    <div class="flex flex-row items-center gap-3">
                                        <div class="w-[200px]">Street</div>
                                        <div class="w-[200px]">City</div>
                                        {#if id}
                                            <div>Primary?</div>
                                        {/if}
                                    </div>
                                    {#each addresses as address}
                                        <div class="flex flex-row items-center gap-3">
                                            <div class="w-[200px]"><Input name="street" value={address.street} readonly={true} /></div>
                                            <div class="w-[200px]"><Input name="city" value={address.city} readonly={true} /></div>
                                            <div class="w-[30px]">
                                                {#if userRole === 'A'}
                                                    <input
                                                        type="checkbox"
                                                        name="primary_address"
                                                        checked={address.is_primary}
                                                        value={address.id}
                                                        on:click={() => setPrimaryAddress(address.id)}
                                                    />
                                                {:else}
                                                    <input
                                                        disabled
                                                        type="checkbox"
                                                        name="primary_address"
                                                        checked={address.is_primary}
                                                        value={address.id}
                                                        on:click={() => setPrimaryAddress(address.id)}
                                                    />
                                                {/if}
                                            </div>
                                            {#if userRole === 'A'}
                                                <div class="delete-address" title="Delete Address">
                                                    <Button variant="ghost" on:click={() => deleteAddress(address.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                                    </Button>
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                    {#if showNewAddressForm}
                                        <div class="flex flex-row items-center gap-3">
                                            <div class="w-[200px]"><Input name="street" bind:value={newAddress.street} /></div>
                                            <div class="w-[200px]"><Input name="city" bind:value={newAddress.city} /></div>
                                        </div>
                                    {/if}
                                </div>
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
{/if}