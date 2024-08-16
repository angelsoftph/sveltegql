<script>
    import axios from 'axios';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';

    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';

    import Toasts from "./Toasts.svelte";
    import { addToast } from "./store";

    let email = '';
    let pword = '';
    let token = '';

    onMount(async () => {
        let auth_token = localStorage.getItem('LM_AUTH_TOKEN');

        if (auth_token) {
            navigate("/employees");
        }
    });

    async function handleLogin() {
        try {
            const response = await axios.post('http://localhost:9000/login', { email, pword });
            token = response.data.token;
            localStorage.setItem('LM_AUTH_TOKEN', token);

            console.log('token', token);

            addToast({ message: "You have successfully logged in", type: "success", dismissible: true, timeout: 1000 });
            navigate('/employees');
        } catch (err) {
            addToast({ message: "Invalid credentials", type: "error", dismissible: true, timeout: 1000 });
        }
    }
</script>

<Toasts />

<form on:submit|preventDefault={handleLogin}>
    <div class="container w-[400px] flex flex-col gap-3 h-screen items-center justify-center">
        <div class="flex flex-row gap-3">
            <div class="flex w-[80px] items-center">Email</div>
            <div class="flex flex-1 items-center"><Input name="email" bind:value={email} /></div>
        </div>
        <div class="flex flex-row gap-3">
            <div class="flex w-[80px] items-center">Password</div>
            <div class="flex flex-1 items-center"><Input name="pword" type="password" bind:value={pword} /></div>
        </div>
        <div class="flex items-center justify-center mt-3">
            <Button type="submit">Login</Button>
        </div>
    </div>
</form>