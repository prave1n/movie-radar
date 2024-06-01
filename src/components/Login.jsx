import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate()
    const [email,setEmail] = useState('');
    const [psw,setPsw] =  useState('');

    const submitHandler =  async () => {
        try{
            await fetch("http://localhost:4000/login", {
                      method: "POST", 
                      headers: {
                          'Access-Control-Allow-Origin':true,
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email:email,
                        password:psw,
                      })
                  })
                  .then((res)=>{
                      return res.json()
                  }).then((res)=>{
                     if(!res.login){
                        alert('Login Credentials are incorrect')
                     }
                     else{
                        console.log(res.token)
                        localStorage.setItem("token", res.token);
                        navigate(`/home`)
                     }
                  })
          }
        catch(err){
          console.log(err)
        }
    }
  return (
    <div>
        <label>Email: </label><br></br>
        <input type="email" placeholder="Enter Email" name="email" required onChange={(e)=>{setEmail(e.target.value)}}/><br></br>
        <label>Password:                 <span><Link to='/resetpsw'>Forgot Password?</Link></span> </label><br></br>
        <input type="password" placeholder="Enter Password" name="psw" required onChange={(e)=>{setPsw(e.target.value)}}/><br></br>
        <button type="submit" onClick={submitHandler}>Login</button>

        <div>
            <p>Dont have an acount? <Link to='/signup'>Sign Up</Link></p>
        </div>
    </div>
  )
}
