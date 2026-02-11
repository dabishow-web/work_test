
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Users, Calendar as CalendarIcon, X, Waves, Flame, UserPlus, Dog, Check } from 'lucide-react';
import { Reservation, ReservationOptions } from '../types';

const MOCK_RESERVATIONS: Reservation[] = [
  { 
    id: '1', 
    roomName: '산수유', 
    guestName: '김지훈', 
    checkIn: format(new Date(), 'yyyy-MM-dd'), 
    checkOut: format(new Date(), 'yyyy-MM-dd'), 
    status: 'confirmed', 
    totalPrice: 150000,
    guestCount: 2,
    options: { jacuzzi: 1, charcoal: 1, extraPerson: 0, pet: 0 }
  },
  { 
    id: '2', 
    roomName: '소나무', 
    guestName: '박서연', 
    checkIn: format(new Date(), 'yyyy-MM-dd'), 
    checkOut: format(new Date(), 'yyyy-MM-dd'), 
    status: 'pending', 
    totalPrice: 350000,
    guestCount: 4,
    options: { jacuzzi: 0, charcoal: 1, extraPerson: 2, pet: 1 }
  },
];

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);

  // New reservation form state
  const [newGuest, setNewGuest] = useState('');
  const [newRoom, setNewRoom] = useState('소나무');
  const [newGuestCount, setNewGuestCount] = useState(2);
  const [newOptions, setNewOptions] = useState<ReservationOptions>({
    jacuzzi: 0,
    charcoal: 0,
    extraPerson: 0,
    pet: 0
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getDayReservations = (date: Date) => {
    return reservations.filter(r => r.checkIn === format(date, 'yyyy-MM-dd'));
  };

  const addReservation = () => {
    if (!newGuest.trim() || !selectedDate) return;
    const res: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      roomName: newRoom,
      guestName: newGuest,
      checkIn: format(selectedDate, 'yyyy-MM-dd'),
      checkOut: format(selectedDate, 'yyyy-MM-dd'),
      status: 'confirmed',
      totalPrice: 0, // Hidden in UI
      guestCount: newGuestCount,
      options: { ...newOptions }
    };
    setReservations([...reservations, res]);
    setNewGuest('');
    setNewGuestCount(2);
    setNewOptions({ jacuzzi: 0, charcoal: 0, extraPerson: 0, pet: 0 });
    setIsModalOpen(false);
  };

  const handleOptionChange = (key: keyof ReservationOptions, delta: number) => {
    setNewOptions(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">예약 관리 시스템</h3>
          <p className="text-slate-500 text-sm font-medium">펜션 전체 객실의 예약 현황을 월별로 관리합니다.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronLeft size={20}/></button>
            <span className="px-6 text-sm font-black text-slate-900 min-w-[140px] text-center">{format(currentMonth, 'yyyy년 MM월')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[650px]">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} className={`py-5 text-center text-[10px] font-black tracking-widest ${d === 'SUN' ? 'text-rose-400' : 'text-slate-400'}`}>{d}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="border-b border-r border-slate-50 bg-slate-50/20"></div>
            ))}
            
            {days.map(day => {
              const res = getDayReservations(day);
              const isSel = selectedDate && isSameDay(day, selectedDate);
              const isSun = day.getDay() === 0;
              return (
                <div 
                  key={day.toISOString()} 
                  onClick={() => setSelectedDate(day)}
                  className={`
                    p-4 border-b border-r border-slate-50 min-h-[110px] cursor-pointer transition-all relative
                    ${isToday(day) ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}
                    ${isSel ? 'ring-2 ring-inset ring-slate-900 z-10 bg-white shadow-inner' : ''}
                  `}
                >
                  <span className={`text-xs font-black ${isToday(day) ? 'text-slate-900' : isSun ? 'text-rose-400' : 'text-slate-400'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-2 space-y-1">
                    {res.slice(0, 3).map(r => (
                      <div key={r.id} className={`text-[9px] p-1.5 rounded-[6px] font-black truncate shadow-sm ${r.status === 'confirmed' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {r.roomName}
                      </div>
                    ))}
                    {res.length > 3 && (
                      <div className="text-[9px] font-black text-slate-300 pl-1">+{res.length - 3} MORE</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Info Sidebar */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">SELECTED DATE</p>
              <h4 className="text-xl font-black text-slate-900">
                {selectedDate ? format(selectedDate, 'MM월 dd일') : '선택 없음'}
              </h4>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Plus size={22} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-2 -mr-2">
            {selectedDate && getDayReservations(selectedDate).length > 0 ? getDayReservations(selectedDate).map(res => (
              <div key={res.id} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-base font-black text-slate-900">{res.guestName} 고객님</h5>
                    <p className="text-xs font-bold text-slate-400 mt-1">{res.roomName}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${res.status === 'confirmed' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {res.status === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-slate-200/50">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <Users size={14} className="text-slate-400" />
                    <span>인원: {res.guestCount}명</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {res.options.jacuzzi > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600">
                        <Waves size={10} className="text-indigo-400"/> 자쿠지({res.options.jacuzzi})
                      </span>
                    )}
                    {res.options.charcoal > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600">
                        <Flame size={10} className="text-orange-400"/> 숯불({res.options.charcoal})
                      </span>
                    )}
                    {res.options.extraPerson > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600">
                        <UserPlus size={10} className="text-emerald-400"/> 추가인원({res.options.extraPerson})
                      </span>
                    )}
                    {res.options.pet > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-600">
                        <Dog size={10} className="text-amber-400"/> 반려견({res.options.pet})
                      </span>
                    )}
                    {Object.values(res.options).every(v => v === 0) && (
                      <span className="text-[10px] font-bold text-slate-300 italic">추가 옵션 없음</span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 flex flex-col items-center gap-4 opacity-30">
                <CalendarIcon size={48} strokeWidth={1.5} />
                <p className="text-sm font-bold">등록된 예약 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">신규 예약 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <CalendarIcon className="text-slate-400" size={20} />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CHECK-IN DATE</p>
                      <p className="text-sm font-black text-slate-900">{selectedDate ? format(selectedDate, 'yyyy. MM. dd') : '-'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">배정 객실</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['소나무', '산수유', '대나무'].map(room => (
                        <button
                          key={room}
                          onClick={() => setNewRoom(room)}
                          className={`py-3 rounded-xl text-xs font-black border transition-all ${newRoom === room ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">예약자 성함</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newGuest}
                      onChange={(e) => setNewGuest(e.target.value)}
                      placeholder="예: 홍길동" 
                      className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">기본 인원</label>
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50 rounded-2xl">
                      <button onClick={() => setNewGuestCount(Math.max(1, newGuestCount - 1))} className="p-2 text-slate-400 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg">-</button>
                      <span className="text-lg font-black text-slate-900">{newGuestCount}명</span>
                      <button onClick={() => setNewGuestCount(newGuestCount + 1)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg">+</button>
                    </div>
                  </div>
                </div>

                {/* Additional Options Grid */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">추가 옵션 수량</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'jacuzzi', label: '자쿠지 이용', icon: Waves, color: 'text-indigo-500' },
                      { key: 'charcoal', label: '숯불 바베큐', icon: Flame, color: 'text-orange-500' },
                      { key: 'extraPerson', label: '추가 인원', icon: UserPlus, color: 'text-emerald-500' },
                      { key: 'pet', label: '반려견 동반', icon: Dog, color: 'text-amber-500' },
                    ].map(opt => (
                      <div key={opt.key} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-slate-50 ${opt.color}`}>
                            <opt.icon size={18} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleOptionChange(opt.key as keyof ReservationOptions, -1)}
                            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900"
                          >-</button>
                          <span className="text-sm font-black text-slate-900 w-4 text-center">{newOptions[opt.key as keyof ReservationOptions]}</span>
                          <button 
                            onClick={() => handleOptionChange(opt.key as keyof ReservationOptions, 1)}
                            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900"
                          >+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all">취소</button>
              <button 
                onClick={addReservation}
                disabled={!newGuest.trim()}
                className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} strokeWidth={3} />
                예약 확정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
