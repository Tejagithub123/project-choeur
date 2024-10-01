import React from 'react'
import bgImg from '../../assets/5.jpg';
import { useForm } from 'react-hook-form';
import '../App.css';
<link rel="stylesheet" 
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

export default function Home() {  


       const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const onSubmit = data => console.log(data);

    // console.log(watch('username'));
    
  return (
    <section>
        
            <div className="col-2">
                <img src={bgImg} alt="" />
            </div>
            
     
    </section>
  )
}