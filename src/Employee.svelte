<script>
    import { Link } from 'svelte-routing';
    import { client } from './lib/graphql-client.js';
    import { onMount } from 'svelte';
    
    import * as Select from "$lib/components/ui/select";
    import Button from '$lib/components/ui/button/button.svelte';
    import { Input } from "$lib/components/ui/input";
    
    import { GET_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE, GET_ADDRESSES, GET_CONTACTS } from './lib/queries.js';
    import "./app.css";
    
    export let id;
    let employee = {};
    let addresses = [];
    let contacts = [];
    let showNewAddressForm = false;
    let showNewContactForm = false;

    function handleNewAddress() {
        showNewAddressForm = true;
    }

    function handleNewContact() {
        showNewContactForm = true;
    }

    console.log('id', id);

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
        employee.id = id;
        await client.request(UPDATE_EMPLOYEE, employee);
        alert("Employee record updated");
        fetchEmployee()
    }

    async function deleteEmployee() {
        await client.request(DELETE_EMPLOYEE, { id });
        alert("Employee record deleted");
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
  
<main>
    <div class="container py-5">
        <div class="flex flex-col items-start">
            <h1 class="text-3xl text-emerald-700">LegalMatch&reg;</h1>
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
                        <Button variant="destructive" on:click={deleteEmployee}>Delete</Button>
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
                                    <div class="w-[200px]"><Input name="contact" value={contact.contact} /></div>
                                    <div class="w-[30px]">
                                        <input
                                            type="checkbox"
                                            name="primary_contact"
                                            checked={contact.is_primary}
                                            value={contact.id}
                                        />
                                    </div>
                                    <div class="delete-contact" title="Delete Contact">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                    </div>
                                </div>
                            {/each}
                            {#if showNewContactForm}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="contact" /></div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="primary_address"
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
                                    <div class="w-[200px]"><Input name="street" value={address.street} /></div>
                                    <div class="w-[200px]"><Input name="city" value={address.city} /></div>
                                    <div class="w-[30px]">
                                        <input
                                            type="checkbox"
                                            name="primary_address"
                                            checked={address.is_primary}
                                            value={address.id}
                                        />
                                    </div>
                                    <div class="delete-address" title="Delete Address">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                    </div>
                                </div>
                            {/each}
                            {#if showNewAddressForm}
                                <div class="flex flex-row items-center gap-3">
                                    <div class="w-[200px]"><Input name="street" /></div>
                                    <div class="w-[200px]"><Input name="city" /></div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="primary_address"
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