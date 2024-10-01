import swal from 'sweetalert';
import bgImg from './assets/4.jpg';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import React, {useEffect, useState} from "react";
//import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
<link rel="stylesheet" 
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

export default function Form() {  
   // const router = useRouter()
    const[nom , setNom]=useState("")
    const[email , setEmail]=useState("")
    const[password , setPassword]=useState("")
    const[prenom , setPrenom]=useState("")
    const[Num_tel, setNum_tel]=useState("")
    const navigate = useNavigate();
    
    const[error , setError]=useState(false);
      async function Add(){
  
          let item = {nom , email ,prenom , Num_tel, password }
         
          let result = await fetch("http://localhost:3001/api/ajoutEcrivain" , {
              method: 'POST',
              body:JSON.stringify(item),
              headers:{
                  "Content-Type" : 'application/json',
                  "Accept" : 'application/json'
              }
          })
         
          result = result.json();
          
          if(result){
            
            navigate('/')
          }
          else{
              swal({
                  title: "Echec d'ajout' ",
                 
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                });
          
          }
         
          //router.push('/');
         
      }
    
  return (
     <div className='oml'>

    <section>
    <div className='App'>
        <div className="register">
            <div className="col-1">
                <h1 className='titre'><b>Sign In</b></h1>
                
                
                
                <form id='form' className='flex flex-col' > 
                <input type="text"  placeholder='Nom'onChange={(e)=>setNom(e.target.value)} />
                
                
                <input type="text"  placeholder='Prenom' className='i1'  onChange={(e)=>setPrenom(e.target.value)}></input>
                
                <input type="text"  placeholder='Email' className='i1'  onChange={(e)=>setEmail(e.target.value)} ></input>
                    
                                  <input type="text"  placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
                   
                    <input type="text"  placeholder='Numéro du téléphone' onChange={(e)=>setNum_tel(e.target.value)} />
                    
                    <button className='btn' onClick={() =>Add()}>Sign In</button>
                    <h4>already have an account? <b className='m'><Link to='/'>Sign up</Link></b></h4><br></br>
                </form>
            </div>
            <div className="col-2">
                <img src={bgImg} alt="" />
            </div>
            

        </div>
        </div>
    </section>
    </div>
  )
}