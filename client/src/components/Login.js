import { useState, useEffect } from "react";
import { session } from '../lib/api'
import { Link } from "react-router-dom"

let Login = () => {
	const [ username, setUsername ] = useState(null)
	const [ password, setPassword ] = useState(null)

	let valid = ( username && password )

	let handleSubmit = async () => {
		if(!valid)
			return alert('Error: Check Inputs')

		let result = await session({
			username: username,
			password: password
		})	

		if(result.error){
			return alert(`Error: ${result.error}`)
		}
		if(result.token){
			console.log(result)
			window.localStorage.setItem('token',result.token)
			return window.location.href = '/'
		}
	}

	return (
		<div className="relative flex w-full h-screen bg-gray-100 overflow-hidden justify-center items-center">
			<div className="z-50 p-6 bg-white rounded-lg shadow-md border flex flex-col items-center space-y-6">
				<h1 className="text-5xl font-bold text-gray-800"> Login </h1>
				<div className="text-xl flex flex-col space-y-3 ">
	        		<input type="email" onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="p-2 rounded-md border bg-gray-100" />
	        		<input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-2 rounded-md border bg-gray-100" />
	        		<button onClick={handleSubmit} class="font-bold hover:bg-indigo-500 border w-full rounded-md border bg-green-500 text-white px-4 py-2 ">Let's Go!</button>
	      		</div>
	      		<Link to="/register" className="text-gray-600"> Register </Link>
      		</div>
      		<div className="absolute top-30 z-0 h-screen rounded-full animate-[spin_8s_linear_infinite] w-96 bg-green-400 blur-3xl"> </div>
      		<div className="absolute bottom-20 z-0 h-screen rounded-full animate-[spin_20s_linear_infinite] w-96 bg-indigo-400 blur-3xl"> </div>

		</div>
	)
}

export default Login;