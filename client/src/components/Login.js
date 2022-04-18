import { apiBase } from '../lib/api'
import { Link } from "react-router-dom"

let Register = () => {
	return (
		<div className="relative flex w-full h-screen bg-gray-100 overflow-hidden justify-center items-center">
			<div className="z-50 p-6 bg-white rounded-lg shadow-md border flex flex-col items-center space-y-6">
				<h1 class="text-5xl font-bold text-gray-800"> Login </h1>
				<form action={ apiBase + "/session"} method="POST" class="text-xl flex flex-col space-y-3 ">
	        		<input type="email" name="email" id="email" placeholder="Email" className="p-2 rounded-md border bg-gray-100" />
	        		<input type="password" name="password" id="password" placeholder="Password" className="p-2 rounded-md border bg-gray-100" />
	        		<button class="font-bold hover:bg-indigo-500 border w-full rounded-md border bg-green-500 text-white px-4 py-2 ">Let's Go!</button>
	      		</form>
	      		<Link to="/register" className="text-gray-600"> Register </Link>
      		</div>

      		<div className="absolute top-30 z-0 h-screen rounded-full animate-[spin_8s_linear_infinite] w-96 bg-green-400 blur-3xl"> </div>
      		<div className="absolute bottom-20 z-0 h-screen rounded-full animate-[spin_20s_linear_infinite] w-96 bg-indigo-400 blur-3xl"> </div>

		</div>
	)
}

export default Register;