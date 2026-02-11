
import React from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  User,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ViewType, UserRole } from '../types';

// 연간 요일별 누적 데이터 (예시)
const yearlyDayOfWeekData = [
  { day: '월', bookings: 420, color: '#94a3b8' },
  { day: '화', bookings: 380, color: '#94a3b8' },
  { day: '수', bookings: 450, color: '#94a3b8' },
  { day: '목', bookings: 510, color: '#94a3b8' },
  { day: '금', bookings: 890, color: '#6366f1' },
  { day: '토', bookings: 1240, color: '#4f46e5' },
  { day: '일', bookings: 980, color: '#818cf8' },
];

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const role = window.localStorage.getItem('user_role') as UserRole || UserRole.ADMIN;

  const stats = [
    { label: '오늘의 예약', value: '12', trend: '+2.5%', isUp: true, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '방문 예정객', value: '45', trend: '명', isUp: null, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: '이번달 매출', value: '₩4,250k', trend: '+15%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '부족 재고', value: '3', trend: '경고', isUp: false, icon: Package, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">펜션 운영 현황</h1>
          <p className="text-slate-500 text-sm font-medium">연간 통계 데이터와 실시간 지표를 기반으로 운영 전략을 수립하세요.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className={`p-1.5 rounded-lg ${role === UserRole.ADMIN ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {role === UserRole.ADMIN ? <ShieldCheck size={16} /> : <User size={16} />}
          </div>
          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{role} MODE</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                <stat.icon size={22} />
              </div>
              {stat.isUp !== null && (
                <div className={`flex items-center text-[11px] font-black ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card - 연간 요일별 통계 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">요일별 누적 예약 분포</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">ANNUAL CUMULATIVE BOOKINGS BY DAY</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
               <span className="text-[10px] font-black text-slate-400 uppercase">가장 활발한 요일:</span>
               <span className="text-xs font-black text-indigo-600">토요일</span>
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyDayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 800}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dx={-15}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}
                  formatter={(value) => [`${value}건`, '누적 예약']}
                />
                <Bar 
                  dataKey="bookings" 
                  radius={[8, 8, 8, 8]}
                  barSize={40}
                >
                  {yearlyDayOfWeekData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-slate-400">
            <AlertCircle size={14} />
            <span className="text-[11px] font-bold">주말(금,토,일)의 예약 비중이 전체의 약 65%를 차지하고 있습니다.</span>
          </div>
        </div>

        {/* Quick Activity Card */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">최근 예약 내역</h3>
            <button 
              onClick={() => onNavigate('calendar')}
              className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex-1 space-y-6">
            {[
              { id: 1, name: '김철수', room: '소나무', options: '자쿠지, 숯불', status: '확정' },
              { id: 2, name: '이영희', room: '산수유', options: '추가인원', status: '대기' },
              { id: 3, name: '박지성', room: '대나무', options: '반려견', status: '확정' },
              { id: 4, name: '최강희', room: '소나무', options: '없음', status: '취소' },
            ].map((res) => (
              <div key={res.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                    {res.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{res.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{res.room} • {res.options}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    res.status === '확정' ? 'bg-emerald-50 text-emerald-600' : 
                    res.status === '대기' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('calendar')}
            className="w-full mt-10 py-4.5 bg-slate-900 text-white rounded-[20px] text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            전체 예약 일정 확인
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default Dashboard;
