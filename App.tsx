
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Package, 
  CalendarDays, 
  Users, 
  Wallet, 
  UserCircle, 
  Bell,
  Search,
  Menu,
  Hotel,
  LogOut,
  Settings
} from 'lucide-react';

import { ViewType, UserRole, UserInfo } from './types';
import DashboardView from './components/Dashboard';
import ChecklistView from './components/Checklist';
import InventoryView from './components/Inventory';
import CalendarView from './components/Calendar';
import StaffBoardView from './components/StaffBoard';
import FinanceView from './components/Finance';
import CustomerManagerView from './components/CustomerManager';
import AuthView from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!user) {
    return <AuthView onLogin={setUser} />;
  }

  // 역할에 따른 네비게이션 항목 필터링
  const allNavItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'checklist', label: '업무 체크리스트', icon: CheckSquare, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'inventory', label: '재고 현황', icon: Package, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'calendar', label: '예약 관리', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'staff', label: '직원 게시판', icon: Users, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'finance', label: '재무 관리', icon: Wallet, roles: [UserRole.ADMIN] },
    { id: 'customer', label: '고객 데이터', icon: UserCircle, roles: [UserRole.ADMIN] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView onNavigate={setActiveView} />;
      case 'checklist': return <ChecklistView />;
      case 'inventory': return <InventoryView />;
      case 'calendar': return <CalendarView />;
      case 'staff': return <StaffBoardView />;
      /* user is non-null here as checked above */
      case 'finance': return <FinanceView user={user} />;
      case 'customer': return <CustomerManagerView />;
      default: return <DashboardView onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-0'} 
        fixed lg:static lg:w-72 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-40 overflow-hidden flex flex-col
      `}>
        <div className="p-8 flex-1">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <Hotel size={22} />
            </div>
            <h1 className="font-bold text-xl text-slate-900 tracking-tight">PensionEase</h1>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as ViewType);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all
                  ${activeView === item.id 
                    ? 'bg-slate-900 text-white font-semibold shadow-md' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={20} strokeWidth={activeView === item.id ? 2.5 : 2} />
                <span className="text-[14px]">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* 관리자 전용 초대 기능 표시 (사이드바 하단) */}
          {user.role === UserRole.ADMIN && (
            <div className="mt-10 pt-6 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Project Invite</p>
               <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-[11px] font-black text-slate-500">초대 코드</span>
                   <span className="text-[13px] font-black text-slate-900 tracking-widest">123456</span>
                 </div>
                 <button 
                  onClick={() => alert('초대 코드가 복사되었습니다: 123456')}
                  className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
                 >
                   코드 복사하기
                 </button>
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">
              {user.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-400 font-medium">{user.role === UserRole.ADMIN ? '관리자' : '스태프'} • {user.pensionName}</p>
            </div>
            <button onClick={() => setUser(null)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {allNavItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input 
                type="text" 
                placeholder="검색어를 입력하세요" 
                className="pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none w-72 transition-all"
              />
            </div>
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all">
              <Bell size={21} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Viewport Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 md:p-12">
          <div className="max-w-[1200px] mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
