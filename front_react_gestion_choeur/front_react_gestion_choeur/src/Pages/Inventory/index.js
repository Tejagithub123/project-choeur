import { Avatar, Rate, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import image from '../../assets/dd.png'
import swal from 'sweetalert';
import SideMenu from "../../Components/SideMenu";
import AppHeader from "../../Components/AppHeader";
import { json } from "react-router-dom";
function Inventory() {
  const [data , setData] = useState([]);
  
 

  return (
    <div className="App1">
    <AppHeader></AppHeader>
    <div className="SideMenuAndPageContent">
      <SideMenu></SideMenu>
    <div className="">
    <section className="py-1 bg-blueGray-50 pr-10 lg:pr-0">
      <div className="w-full xl:w-11/12 mb-12 xl:mb-0 px-4 mx-5 mt-12 mr-40 lg:mr-0">
      <h1 className="text-3xl my-2" size="10px"><b><br className="lc"></br>&nbsp;&nbsp;&nbsp;&nbsp;
Liste des Candidats</b></h1><br /><br/>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="lg:flex items-center">
              <div className="relative w-full px-4 max-w-full flex">
               
                <div className="flex gap-x-3 rounded-tr-xl rounded-br-xl  border border-gray-100 p-2  item-center">
                &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp; <b className="re">Rechercher</b><input type="text" placeholder="      Rechercher" className="search"
                                           />
                </div>
              </div>
              
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="tablC" width="1000px" >
              <thead >
                <tr className="head">
               
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Nom  
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                   Prenom
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Email
                  </th>

                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                   Téléphone
                  </th>

                  
                  
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                   &nbsp;&nbsp;&nbsp;&nbsp; Actions
                  </th>
                </tr>
              </thead>
              <tbody className="heads"> {
                                data.map((item) => (
                                    <tr >
                                        
                                       
                                       
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                            {
                                            item.nom
                                        } </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                            {
                                            item.prenom
                                        } </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {
                                            item.email} </td>
                                        
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {
                                            item.Num_tel
                                        } </td>
                                        
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex">
                                            
                                        <span  ><figure>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;<img src={image} width="20px" height="20px" />
                            </figure></span>
                                           
                                        
                                             
                                        </td>
                                    </tr>
                                ))
                            } </tbody>
              
             
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>

</div>
</div>

  );
}
export default Inventory;
