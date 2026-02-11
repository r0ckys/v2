import React from 'react';
import { MoreVertical, ExternalLink } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: any[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600';
      case 'pending':
        return 'bg-amber-50 text-amber-600';
      case 'cancelled':
      case 'returned':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Recent Order</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {order.customerName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">৳{order.amount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
