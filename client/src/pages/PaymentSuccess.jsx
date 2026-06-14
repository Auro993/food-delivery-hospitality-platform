import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-600 mb-4">Your order has been confirmed</p>
        <p className="text-sm text-gray-500 mb-6">Order ID: #{orderId?.slice(-8)}</p>
        <div className="space-y-3">
          <Link to={`/tracking/${orderId}`} className="btn-primary inline-flex items-center gap-2 w-full justify-center">
            <ShoppingBag className="w-4 h-4" />
            Track Order
          </Link>
          <Link to="/" className="text-primary hover:underline inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;