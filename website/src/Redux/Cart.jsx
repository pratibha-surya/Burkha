import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { FaShoppingCart, FaMoneyCheck } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { qntyIncrease, qntyDecrease, itemRemove } from './CardSlice';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
 
  const Data=useSelector(state=>state.mycart.cart);
  const dispatch= useDispatch();
  console.log(Data);
  const navigate= useNavigate();


  const mynavigation=(e)=>{
       e.preventDefault();
       navigate("/checkout")
  }



  let totalAmount=0;
  const ans=Data.map((key)=>{
    totalAmount+=key.price*key.qnty;
    return(
      <>
        <tr>
          <td> 
          <img src={`https://e-commerce-project2-1.onrender.com/${key.image}`}  style={{height:'60px'}}/>
          </td>
          <td> {key.name} </td>
          <td> {key.price} </td>
          <td>
          
          <a href="#" onClick={()=>{dispatch(qntyDecrease({id:key.id}))}}>
          <FaMinusCircle /> 
          </a>
             {key.qnty} 
          <a href="#" onClick={()=>{dispatch(qntyIncrease({id:key.id}))}}>
          <FaPlusCircle /> 
            </a>    
           
             </td>
          <td> {key.qnty * key.price} </td>
          <td> 
          <Button variant='primary' size="sm" onClick={()=>{dispatch(itemRemove({id:key.id}))}}> Remove </Button>
           </td>
        </tr>
      </>
    )
  })
  return (
    <>
 
  
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
         <div ><FaShoppingCart /> Your Cart  </div>
         <div style={{border:"2px solid black", padding:"5px", borderRadius:"10px"}}><FaMoneyCheck /> Total: {totalAmount}</div>
         <div>
          <Button variant="primary" 
          onClick={mynavigation} > <FaMoneyCheck /> Checkout </Button></div>
      </div>
      
      <div style={{height:"50vh", overflowY:"scroll"}}>
        <Table striped bordered hover>
          <thead style={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1}}>
            <tr className='cart'>
              <th>Images</th>
              <th>Product</th>
              <th> Price </th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody >

           {ans}

           <th  style={{fontWeight:"700"}}>Total Price</th>
              <th></th>
              <th> </th>
              <th></th>
              <th style={{fontWeight:"700"}}> ₹{totalAmount} </th>
              <th> </th>
          </tbody>
        </Table>
      </div>
     
    </div>
    </>
  )
}

export default Cart