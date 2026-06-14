import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed! 😞</h1>
        <p className="text-gray-600 mb-4">Your payment could not be processed</p>
        <p className="text-sm text-gray-500 mb-6">Please try again or use another payment method</p>
        <div className="space-y-3">
          <Link to="/cart" className="btn-primary inline-flex items-center gap-2 w-full justify-center">
            <ArrowLeft className="w-4 h-4" />
            Go Back to Cart
          </Link>
          <Link to="/" className="text-primary hover:underline inline-flex items-center gap-2">
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;