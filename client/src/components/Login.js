import { apiBase } from '../lib/api'

let Login = () => {
	return (
		<div className="flex">
			<form action={ apiBase + "/session"} method="POST" class="flex flex-col ">
        		<input type="email" name="email" id="email" placeholder="Email"/>
        		<input type="password" name="password" id="password" placeholder="Password" />
        		<button class="text-black border w-full rounded border-black">Let's Go!</button>
      		</form>
		</div>
	)
}

export default Login;