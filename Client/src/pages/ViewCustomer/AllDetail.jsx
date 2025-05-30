// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';


// const AllDetail = () => {
//   const { id } = useParams();
//   const [payments, setPayments] = useState([]);
//   const [order, setOrder] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderAndPayments = async () => {
//       try {
//         const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/order/${id}`);
//         setOrder(orderRes.data.order);
        
//         // Extract customer from the first order item's address
//         if (orderRes.data.order?.orderItems?.[0]?.address) {
//           setCustomer(orderRes.data.order.orderItems[0].address);
//         }

//         const paymentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/payments/${id}`);
//         setPayments(paymentsRes.data.payments || []);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setLoading(false);
//       }
//     };

//     fetchOrderAndPayments();
//   }, [id]);

//   const handlePaymentSuccess = async (newPayment) => {
//     try {
//       setPayments([...payments, newPayment]);
//       const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/order/${id}`);
//       setOrder(orderRes.data.order);
//     } catch (err) {
//       console.error('Error updating order after payment:', err);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>;
//   }

//   if (!order) {
//     return <div className="container mx-auto px-4 py-8">Order not found</div>;
//   }

//   const { dueAmount, createdAt } = order;
//   const firstOrderDate = new Date(createdAt).toLocaleDateString();
//   const lastOrderDate = new Date(createdAt).toLocaleDateString(); // Assuming same as first for now

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Customer Details Section */}
    

//       {/* Payment Form (Hidden if dueAmount is 0) */}
     

//       {/* Payments History */}
//       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//         <h2 className="text-xl font-semibold mb-4">Payment History</h2>

//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>


//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque Number</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
           
           
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {payments.length > 0 ? (
//               payments.map((payment) => (
//                 <tr key={payment._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.dueAmount|| 'N/A'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.totalPrice|| 'N/A'}</td>


//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode || 'N/A'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount?.toLocaleString() || 0}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   { payment.chequeNumber && payment.chequeNumber !== '' ? payment.chequeNumber : 'N/A' }
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {payment.receivingDate
//                       ? new Date(payment.receivingDate).toLocaleDateString()
//                       : 'N/A'}
//                   </td>
//                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.remark || '-'}</td> */}
                
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No payments recorded yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllDetail;



import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AllDetail = () => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAndPayments = async () => {
      try {
        const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/order/${id}`);
        setOrder(orderRes.data.order);
        
        if (orderRes.data.order?.orderItems?.[0]?.address) {
          setCustomer(orderRes.data.order.orderItems[0].address);
        }

        const paymentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/payments/${id}`);
        setPayments(paymentsRes.data.payments || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchOrderAndPayments();
  }, [id]);

  const handlePaymentSuccess = async (newPayment) => {
    try {
      setPayments([...payments, newPayment]);
      const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/order/${id}`);
      setOrder(orderRes.data.order);
    } catch (err) {
      console.error('Error updating order after payment:', err);
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = payments.map(payment => ({
      'Pending Amount': order?.dueAmount || 'N/A',
      'Total Amount': order?.totalPrice || 'N/A',
      'Payment Mode': payment.paymentMode || 'N/A',
      'Amount': payment.amount || 0,
      'Cheque Number': payment.chequeNumber || 'N/A',
      'Receiving Date': payment.receivingDate 
        ? new Date(payment.receivingDate).toLocaleDateString() 
        : 'N/A'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment History');
    
    // Export the file
    XLSX.writeFile(workbook, `PaymentHistory_Order_${id}.xlsx`);
  };

  const exportToPDF = () => {
    // Create new PDF
    const doc = new jsPDF();
    
    // Title
    doc.text(`Payment History - Order ${id}`, 14, 15);
    
    // Prepare data for PDF
    const headers = [
      ['Pending Amount', 'Total Amount', 'Payment Mode', 'Amount', 'Cheque Number', 'Receiving Date']
    ];
    
    const data = payments.map(payment => [
      order?.dueAmount || 'N/A',
      order?.totalPrice || 'N/A',
      payment.paymentMode || 'N/A',
      payment.amount || 0,
      payment.chequeNumber || 'N/A',
      payment.receivingDate ? new Date(payment.receivingDate).toLocaleDateString() : 'N/A'
    ]);
    
    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Save the PDF
    doc.save(`PaymentHistory_Order_${id}.pdf`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Customer Details Section */}
    
      {/* Payment History Section */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          <div className="space-x-2">
            <button 
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Export to Excel
            </button>
            <button 
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Export to PDF
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.dueAmount || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.totalPrice || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.chequeNumber && payment.chequeNumber !== '' ? payment.chequeNumber : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.receivingDate
                      ? new Date(payment.receivingDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No payments recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDetail;