import React, { useState, useMemo } from 'react';
import { Reservation, FinanceEntry, UserInfo, UserRole } from '../types';
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Calculator,
  Plus,
  X,
  Receipt,
  Trash2,
  Check,
  PieChart,
  List
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, addDays, isSameDay } from 'date-fns';

// 예약 관리와 연동되는 모의 데이터
const MOCK_RESERVATIONS: Reservation[] = [
  { id: '1', roomName: '산수유', guestName: '김지훈', checkIn: '2024-04-05', checkOut: '2024-04-06', status: 'confirmed', totalPrice: 150000, guestCount: 2, options: { jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 } },
  { id: '2', roomName: '소나무', guestName: '박서연', checkIn: '2024-04-10', checkOut: '2024-04-11', status: 'confirmed', totalPrice: 180000, guestCount: 2, options: { jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 } },
  { id: '3', roomName: '대나무', guestName: '이하늘', checkIn: '2024-04-05', checkOut: '2024-04-07', status: 'confirmed', totalPrice: 320000, guestCount: 2, options: { jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 } },
  { id: '4', roomName: '산수유', guestName: '최민수', checkIn: '2024-04-15', checkOut: '2024-04-16', status: 'confirmed', totalPrice: 150000, guestCount: 2, options: { jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 } },
  { id: '5', roomName: '소나무', guestName: '정수정', checkIn: '2024-04-15', checkOut: '2024-04-16', status: 'confirmed', totalPrice: 180000, guestCount: 2, options: { jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 } },
];

interface FinanceProps {
  user: UserInfo;
}

const Finance: React.FC<FinanceProps> = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 3, 1));
  const [selectedDateForExpense, setSelectedDateForExpense] = useState<Date | null>(null);
  const [dailyExpenses, setDailyExpenses] = useState<FinanceEntry[]>([]);
  
  const [expenseItemTemplates, setExpenseItemTemplates] = useState<string[]>([
    '장작&숯', '디퓨저용기', '쿠킹호일', '캡슐커피', '녹차&페퍼민트', '쓰레기봉투', '위생봉투', '청소비'
  ]);

  const [fixedExpenses, setFixedExpenses] = useState([
    { id: 'f1', name: '정수기', amount: 65800 },
    { id: 'f2', name: '인터넷&TV', amount: 84700 },
    { id: 'f3', name: '넷플릭스', amount: 29000 },
  ]);

  const [newFixedName, setNewFixedName] = useState('');
  const [newFixedAmount, setNewFixedAmount] = useState<number>(0);
  const [isAddingFixed, setIsAddingFixed] = useState(false);

  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(0);

  const rooms = ['산수유', '소나무', '대나무'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const weeks = useMemo(() => {
    const weeksArr = [];
    let current = calendarStart;
    while (current <= calendarEnd) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        weekDays.push(current);
        current = addDays(current, 1);
      }
      weeksArr.push(weekDays);
    }
    return weeksArr;
  }, [calendarStart, calendarEnd]);

  const getRevenueForDate = (date: Date, room: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const res = MOCK_RESERVATIONS.find(r => r.checkIn === dateStr && r.roomName === room);
    return res ? res.totalPrice : null;
  };

  // 지출 항목별 합계 및 전체 합계 계산
  const expenseAnalytics = useMemo(() => {
    const currentMonthExpenses = dailyExpenses.filter(e => isSameMonth(new Date(e.date), currentDate));
    
    // 항목별 합계
    const breakdown = currentMonthExpenses.reduce((acc, curr) => {
      acc[curr.description] = (acc[curr.description] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    // 날짜별로 그룹화 (상세 내역용)
    const groupedByDate = currentMonthExpenses.reduce((acc, curr) => {
      acc[curr.date] = acc[curr.date] || [];
      acc[curr.date].push(curr);
      return acc;
    }, {} as Record<string, FinanceEntry[]>);

    const fixedTotal = fixedExpenses.reduce((s, e) => s + e.amount, 0);
    const dailyTotal = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);

    return { breakdown, groupedByDate, fixedTotal, dailyTotal, grandTotal: fixedTotal + dailyTotal };
  }, [currentDate, dailyExpenses, fixedExpenses]);

  // Fix: Removed duplicated 'totals' useMemo block which was causing scope and type inference issues
  const totals = useMemo(() => {
    const revs = MOCK_RESERVATIONS.filter(r => isSameMonth(new Date(r.checkIn), currentDate));
    const sanRev = revs.filter(r => r.roomName === '산수유').reduce((s, r) => s + r.totalPrice, 0);
    const soRev = revs.filter(r => r.roomName === '소나무').reduce((s, r) => s + r.totalPrice, 0);
    const daeRev = revs.filter(r => r.roomName === '대나무').reduce((s, r) => s + r.totalPrice, 0);
    const totalRev = sanRev + soRev + daeRev;
    
    return { sanRev, soRev, daeRev, totalRev, totalExpense: expenseAnalytics.grandTotal };
  }, [currentDate, expenseAnalytics.grandTotal]);

  const addDailyExpense = () => {
    if (!selectedDateForExpense || !newExpenseName.trim()) return;
    
    const entry: FinanceEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(selectedDateForExpense, 'yyyy-MM-dd'),
      type: 'expense',
      category: '기타 비품',
      description: newExpenseName,
      amount: newExpenseAmount
    };

    setDailyExpenses([...dailyExpenses, entry]);
    if (!expenseItemTemplates.includes(newExpenseName)) {
      setExpenseItemTemplates([...expenseItemTemplates, newExpenseName]);
    }
    setNewExpenseName('');
    setNewExpenseAmount(0);
    setSelectedDateForExpense(null);
  };

  const addFixedExpense = () => {
    if (!newFixedName.trim()) return;
    setFixedExpenses([...fixedExpenses, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: newFixedName, 
      amount: newFixedAmount 
    }]);
    setNewFixedName('');
    setNewFixedAmount(0);
    setIsAddingFixed(false);
  };

  const deleteFixedExpense = (id: string) => {
    setFixedExpenses(fixedExpenses.filter(e => e.id !== id));
  };

  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {format(currentDate, 'M')}월 {user.pensionName} 재무 리포트
          </h3>
          <p className="text-slate-500 text-sm font-medium">가계부 형식으로 일별 지출과 매출을 한눈에 분석합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronLeft size={18}/></button>
            <span className="px-4 text-sm font-black text-slate-900 min-w-[100px] text-center">{format(currentDate, 'yyyy. MM')}</span>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Calendar & Settlement */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue & Daily Entry</span>
               <div className="flex items-center gap-2 text-[10px] text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-lg">
                 <Plus size={12} /> 날짜를 클릭하여 지출을 입력하세요
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-4 border-r border-slate-100 text-center w-24">Room</th>
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                      <th key={day} className={`px-2 py-4 text-center border-r border-slate-100 last:border-r-0 ${i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : ''}`}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, weekIdx) => (
                    <React.Fragment key={weekIdx}>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <td className="border-r border-slate-100"></td>
                        {week.map((day, dayIdx) => (
                          <td 
                            key={dayIdx} 
                            onClick={() => setSelectedDateForExpense(day)}
                            className={`
                              px-2 py-2 text-center text-[11px] font-black border-r border-slate-100 last:border-r-0 cursor-pointer hover:bg-slate-900 hover:text-white transition-all
                              ${!isSameMonth(day, currentDate) ? 'text-slate-100' : dayIdx === 0 ? 'text-rose-400' : dayIdx === 6 ? 'text-blue-400' : 'text-slate-400'}
                            `}
                          >
                            {format(day, 'd')}
                          </td>
                        ))}
                      </tr>
                      {rooms.map((room) => (
                        <tr key={room} className="border-b border-slate-50 last:border-b-slate-100 group">
                          <td className="px-4 py-3 border-r border-slate-100 text-[10px] font-black text-slate-400 bg-slate-50/20 group-hover:bg-slate-100 transition-all uppercase tracking-tight">
                            {room}
                          </td>
                          {week.map((day, dayIdx) => {
                            const revenue = getRevenueForDate(day, room);
                            return (
                              <td key={dayIdx} className="px-1 py-3 text-center border-r border-slate-100 last:border-r-0">
                                {revenue ? (
                                  <div className="text-[10px] font-black text-slate-900 bg-emerald-50 text-emerald-700 py-1 rounded-lg">
                                    {(revenue / 10000).toFixed(1)}
                                  </div>
                                ) : (
                                  <div className="h-4 border-b border-dotted border-slate-200 mx-2"></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Settlement Summary */}
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
                   <TrendingUp size={24} />
                 </div>
                 <h4 className="text-2xl font-black tracking-tight">당월 정산 결과</h4>
               </div>
               <div className="grid grid-cols-2 gap-8 pt-4">
                 <div>
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-1">총 수익</p>
                    <p className="text-2xl font-black tracking-tight text-white">₩{totals.totalRev.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-1">총 지출 (고정+변동)</p>
                    <p className="text-2xl font-black tracking-tight text-rose-400">- ₩{totals.totalExpense.toLocaleString()}</p>
                 </div>
               </div>
            </div>
            
            <div className="h-24 w-px bg-white/10 hidden md:block"></div>

            <div className="flex-1 text-right">
              <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Net Cash Flow</p>
              <h4 className="text-5xl font-black tracking-tighter mb-1 text-white">
                {/* Fix: Calculation is now safe after fixing 'totals' duplication and scope issues */}
                ₩{(totals.totalRev - totals.totalExpense).toLocaleString()}
              </h4>
              <p className="text-sm font-bold text-white/40">이번 달 순현금 흐름</p>
            </div>
          </div>
        </div>

        {/* Right: Sidebar (Expense Analytics & Log) */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* 1. 항목별 지출 요약 (Analytics) */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PieChart size={20} className="text-slate-400" />
                <span>지출 항목별 요약</span>
              </h4>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">Monthly Total</span>
            </div>
            
            <div className="space-y-6">
              {Object.entries(expenseAnalytics.breakdown).length > 0 ? (
                Object.entries(expenseAnalytics.breakdown).map(([name, amount]) => {
                  const percentage = Math.round((amount / expenseAnalytics.dailyTotal) * 100);
                  return (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-600">{name}</span>
                        <span className="text-slate-900">₩{amount.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-900 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-right text-slate-400 font-black">{percentage}% of Daily Exp.</p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-[11px] font-bold text-slate-300">집계된 지출 데이터가 없습니다.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex justify-between text-xs font-black">
                 <span className="text-slate-400 uppercase tracking-widest">변동 지출 소계</span>
                 <span className="text-slate-900">₩{expenseAnalytics.dailyTotal.toLocaleString()}</span>
               </div>
            </div>
          </div>

          {/* 2. 고정 경비 (Fixed) */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calculator size={20} className="text-slate-400" />
                <span>매월 고정 경비</span>
              </h4>
              {isAdmin && (
                <button 
                  onClick={() => setIsAddingFixed(!isAddingFixed)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
            
            <div className="space-y-1">
              {isAddingFixed && (
                <div className="bg-slate-50 p-4 rounded-2xl mb-4 space-y-3 border border-slate-100 animate-in slide-in-from-top-2">
                  <input type="text" placeholder="항목명" value={newFixedName} onChange={(e) => setNewFixedName(e.target.value)} className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg outline-none" />
                  <input type="number" placeholder="금액" value={newFixedAmount} onChange={(e) => setNewFixedAmount(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg outline-none" />
                  <div className="flex gap-2">
                    <button onClick={addFixedExpense} className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg">추가</button>
                    <button onClick={() => setIsAddingFixed(false)} className="flex-1 py-2 bg-slate-200 text-slate-500 text-[10px] font-black rounded-lg">취소</button>
                  </div>
                </div>
              )}
              {fixedExpenses.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-dotted border-slate-100 group">
                  <span className="text-sm font-bold text-slate-500">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">₩{item.amount.toLocaleString()}</span>
                    {isAdmin && (
                      <button onClick={() => deleteFixedExpense(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 일별 지출 상세 (Log) */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
            <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-8">
              <List size={20} className="text-slate-400" />
              <span>지출 상세 기록</span>
            </h4>
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 -mr-2">
              {Object.entries(expenseAnalytics.groupedByDate).length > 0 ? (
                Object.entries(expenseAnalytics.groupedByDate)
                  .sort((a, b) => b[0].localeCompare(a[0])) // 최근 날짜순
                  .map(([date, items]) => (
                    <div key={date} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-100"></div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{date}</span>
                        <div className="h-px flex-1 bg-slate-100"></div>
                      </div>
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-xl">
                            <span className="text-xs font-bold text-slate-700">{item.description}</span>
                            <span className="text-xs font-black text-slate-900">₩{item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-10 opacity-30 italic font-bold text-slate-400 text-xs">
                  지출 내역이 비어있습니다.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Expense Input Modal */}
      {selectedDateForExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-sm rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                  <Receipt size={24} />
                </div>
                <button onClick={() => setSelectedDateForExpense(null)} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={24}/></button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">가계부 입력</h3>
              <p className="text-sm font-bold text-slate-400 mt-1">{format(selectedDateForExpense, 'yyyy년 MM월 dd일')}</p>
            </div>
            
            <div className="p-10 pt-0 space-y-8 mt-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">항목 선택 또는 직접 입력</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* Fix: 'expenseItemTemplates' is now correctly inferred as 'string[]' after fixing component duplication */}
                  {expenseItemTemplates.map((template: string) => (
                    <button 
                      key={template}
                      onClick={() => setNewExpenseName(template)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${newExpenseName === template ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="항목 이름을 입력하세요" 
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[20px] text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">지출 금액 (₩)</label>
                <input 
                  type="number" 
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-[20px] text-lg font-black focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
              </div>

              <button 
                onClick={addDailyExpense}
                disabled={!newExpenseName.trim() || newExpenseAmount <= 0}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-base shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} strokeWidth={3} />
                가계부 등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;