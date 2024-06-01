import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()
  const [fname,setFname] = useState('');
  const [lname,setLname] =  useState('');
  const [email,setEmail] = useState('');
  const [psw,setPsw] =  useState('');
  
  let result = true;
  const pswchecker =  new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')

  const submitHandler = async ()=>{
    try{
      if(fname.length === 0 || lname.length === 0){
        alert("Please fill in all the fields to create an account")
        result = false

      }
      if(!/\S+@\S+\.\S+/.test(email)){
        alert("Please enter a valid email")
        result = false

      }
      if(!pswchecker.test(psw)){
        alert("Password must have minimum eight characters, at least one captial letter,at least one captial letter, one number and one special character:")
        result = false

      }
      if(result){
        await fetch("http://localhost:4000/signIn", {
                method: "POST", 
                headers: {
                    'Access-Control-Allow-Origin':true,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firstname: fname,
                  lastname:lname,
                  email:email,
                  password:psw,
                })
            })
            .then((res)=>{
                return res.json()
            }).then((res)=>{
                console.log(res)
                navigate('/')
                alert('Account Creater Successfully. Please log in')
            })
      }
    }
  catch(err){
    console.log(err)
  }

  }

  return (
    <div className='loginbody'>
        <label>First Name: </label><br></br>
        <input type="text" placeholder="Enter your first name" name="fname" required onChange={(e)=>{setFname(e.target.value)}}/><br></br>

        <label>Last Name: </label><br></br>
        <input type="text" placeholder="Enter your last name" name="lname" required onChange={(e)=>{setLname(e.target.value)}}/><br></br>

        <label>Email: </label><br></br>
        <input type="email" placeholder="Enter Email" name="email" required onChange={(e)=>{setEmail(e.target.value)}}/><br></br>

        <label>Password: </label><br></br>
         <input type="password" placeholder="Enter Password" name="psw" required onChange={(e)=>{setPsw(e.target.value)}}/><br></br>
         
        <button type="submit" onClick={submitHandler}>Sign Up</button>
         
    </div>
  )
}

export default Signup