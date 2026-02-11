
import React, { useState } from 'react';
import { Customer } from '../types';
import { Search, UserPlus, Phone, Mail, MoreHorizontal, User, History } from 'lucide-react';

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: '김지훈', phone: '010-1234-5678', email: 'kim@example.com', note: '가족 여행 선호, 고층 선호', lastVisit: '2024-05-10' },
  { id: '2', name: '박민지', phone: '010-9876-5432', email: 'park@example.com', note: '결혼 기념일, 바베큐 필수', lastVisit: '2024-04-15' },
  { id: '3', name: '최현우', phone: '010-1111-2222', email: 'choi@example.com', note: '애견 동반 가능 여부 항상 문의', lastVisit: '2024-03-20' },
  { id: '4', name: '정다은', phone: '010-4444-5555', email: 'jung@example.com', note: 'VIP 고객, 연 3회 이상 방문', lastVisit: '2024-05-01' },
];

const CustomerManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.includes(search) || c.phone.includes(search) || c.email.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">고객 정보 관리</h3>
          <p className="text-slate-500">방문 이력 및 고객 특이사항을 관리하세요.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2">
          <UserPlus size={18} />
          새 고객 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="이름, 연락처, 이메일 검색..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">고객명</th>
                <th className="px-6 py-4">연락처</th>
                <th className="px-6 py-4">이메일</th>
                <th className="px-6 py-4">최근 방문</th>
                <th className="px-6 py-4">특이사항</th>
                <th className="px-6 py-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {customer.name[0]}
                      </div>
                      <span className="font-bold text-slate-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={14} className="text-slate-400" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="text-slate-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <History size={14} className="text-slate-400" />
                      {customer.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-xs text-slate-500 truncate">{customer.note}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManager;
