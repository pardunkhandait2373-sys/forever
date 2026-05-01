import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const ORDER_STATUS_STEPS = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])
  const [openTrackers, setOpenTrackers] = useState({})

  const toggleTracker = (orderKey) => {
    setOpenTrackers((prev) => ({
      ...prev,
      [orderKey]: !prev[orderKey],
    }))
  }

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['orderId'] = order._id
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={`${item.orderId}-${index}`} className='py-4 border-t border-b text-gray-700 flex flex-col gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <button
                          onClick={() => toggleTracker(`${item.orderId}-${index}`)}
                          className='border px-4 py-2 text-sm font-medium rounded-sm'
                        >
                          Track Order
                        </button>
                    </div>
                    {openTrackers[`${item.orderId}-${index}`] && (
                      <div className='pt-1'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                          {ORDER_STATUS_STEPS.map((step, stepIndex) => {
                            const currentStepIndex = ORDER_STATUS_STEPS.indexOf(item.status)
                            const isComplete = stepIndex <= currentStepIndex
                            const showConnector = stepIndex < ORDER_STATUS_STEPS.length - 1

                            return (
                              <div key={step} className='flex items-center flex-1 min-w-0'>
                                <div className='flex items-center gap-2'>
                                  <span
                                    className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`}
                                  ></span>
                                  <p className={`text-xs sm:text-sm ${isComplete ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                    {step}
                                  </p>
                                </div>
                                {showConnector && (
                                  <span
                                    className={`hidden sm:block h-0.5 flex-1 mx-3 ${stepIndex < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}
                                  ></span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
