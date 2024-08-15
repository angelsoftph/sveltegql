<script>
  import { Router, Route } from 'svelte-routing';
  import Employee from './Employee.svelte';
  import Employees from './Employees.svelte';

  import "./app.css";
</script>

<Router>
  <Route path="/" component={Employees} />
  <Route path="/employee/:id" component={Employee} />
</Router>

<main>
  <Router />
</main>
