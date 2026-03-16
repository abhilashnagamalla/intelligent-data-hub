import { useNavigate } from "react-router-dom";

export default function Register(){

  const navigate = useNavigate();

  return(

    <div style={{padding:"50px"}}>

      <h2>Register</h2>

      <input placeholder="email"/>

      <br/><br/>

      <input placeholder="password"/>

      <br/><br/>

      <button onClick={()=>navigate("/login")}>
        Create Account
      </button>

    </div>

  )

}