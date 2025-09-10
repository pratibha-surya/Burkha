import React from 'react'
import AddAddressForm from './AddAddressForm'
import AddressList from './AddressList'

const Addresses = () => {
  return (
    <div className='bg-gray-200 p-4 rounded'>
      <AddAddressForm />
      <AddressList/>
    </div>
  )
}

export default Addresses