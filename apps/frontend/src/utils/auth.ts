import axios from 'axios'

export const BACKEND_URL="http://localhost:8080"
export type SigninInput={
	username:string,
	password:string
}
export async function Signup(input:SigninInput){
   
		const response = await axios.post(
		  `${BACKEND_URL}/api/v1/signup`,
		  input,
		  {
			headers: {
			  "Content-Type": "application/json",
			},
		  }
		)
	  
		return response.data
 }	
	


export async function Signin(input:SigninInput){
   
	const response = await axios.post(
	  `${BACKEND_URL}/api/v1/signin`,
	  input,
	  {
		headers: {
		  "Content-Type": "application/json",
		},
	  }
	)
  
	return response.data
}	

