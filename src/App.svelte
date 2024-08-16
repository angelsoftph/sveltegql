<script>
  import { Router, Route } from 'svelte-routing';
  import Employee from './Employee.svelte';
  import Employees from './Employees.svelte';
  import Login from './Login.svelte';

  import "./app.css";
</script>

<Router>
  <Route path="/" component={Login} />
  <Route path="/employees" component={Employees} />
  <Route path="/employee/" component={Employee} />
  <Route path="/employee/:id" component={Employee} />
</Router>

<main>
  <Router />
</main>
