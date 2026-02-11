
import React, { useState, useMemo } from 'react';
import { CategoryType, ChecklistItem, DailyLog, UserRole, UserInfo } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  X, 
  Layout, 
  Home, 
  Package, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  UserCheck,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format, addDays, subDays, isSameDay } from 'date-fns';

// 마스터 업무 템플릿
const MASTER_TASKS: ChecklistItem[] = [
  { id: '1', category: CategoryType.PR, task: '인스타그램 오늘의 사진 업로드' },
  { id: '2', category: CategoryType.ROOM, task: '배정 객실(소나무, 산수유, 대나무) 청소 점검' },
  { id: '3', category: CategoryType.INVENTORY_CHECK, task: '어메니티(일회용품) 재고 확인' },
  { id: '4', category: CategoryType.RESERVATION_CHECK, task: '당일 예약 고객 입실 안내 연락' },
  { id: '5', category: CategoryType.ROOM, task: '공용 바베큐장 그릴 및 테이블 세척' },
  { id: '6', category: CategoryType.INVENTORY_CHECK, task: '비품 분리수거 및 쓰레기장 정리' },
];

const Checklist: React.FC = () => {
  // 실제 앱에서는 컨텍스트에서 가져오지만 시연을 위해 로컬스토리지 모의 사용
  const userStr = localStorage.getItem('user');
  const user: UserInfo = userStr ? JSON.parse(userStr) : { id: 'admin', name: '관리자', role: UserRole.ADMIN, pensionName: '오션뷰' };

  const [tasks, setTasks] = useState<ChecklistItem[]>(MASTER_TASKS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<Record<string, DailyLog>>({}); // 날짜별 로그 저장
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<CategoryType>(CategoryType.ROOM);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentDayLog = logs[dateKey] || {};

  // 업무 상태 업데이트 함수
  const updateTaskStatus = (taskId: string, field: 'staffDone' | 'adminVerified') => {
    // 권한 체크
    if (field === 'adminVerified' && user.role !== UserRole.ADMIN) {
      alert('관리자만 최종 승인이 가능합니다.');
      return;
    }

    setLogs(prev => {
      const dayLog = prev[dateKey] || {};
      const taskStatus = dayLog[taskId] || { staffDone: false, adminVerified: false };
      
      return {
        ...prev,
        [dateKey]: {
          ...dayLog,
          [taskId]: {
            ...taskStatus,
            [field]: !taskStatus[field]
          }
        }
      };
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const item: ChecklistItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: newTaskCategory,
      task: newTask,
    };
    setTasks([item, ...tasks]);
    setNewTask('');
    setIsModalOpen(false);
  };

  const deleteTask = (id: string) => {
    if (user.role !== UserRole.ADMIN) {
      alert('마스터 업무 삭제는 관리자만 가능합니다.');
      return;
    }
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory);

  // 통계 계산
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => currentDayLog[t.id]?.staffDone).length;
    const verified = tasks.filter(t => currentDayLog[t.id]?.adminVerified).length;
    const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;
    const verifiedPercent = total > 0 ? Math.round((verified / total) * 100) : 0;
    
    return { total, done, verified, donePercent, verifiedPercent };
  }, [tasks, currentDayLog]);

  const getCategoryIcon = (cat: CategoryType | 'All') => {
    switch(cat) {
      case CategoryType.PR: return <Layout size={20} />;
      case CategoryType.ROOM: return <Home size={20} />;
      case CategoryType.INVENTORY_CHECK: return <Package size={20} />;
      case CategoryType.RESERVATION_CHECK: return <Calendar size={20} />;
      default: return <CheckCircle2 size={20} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header: Date Selector & Collaboration Summary */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-[24px] border border-slate-100">
            <button 
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="p-3 hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
            >
              <ChevronLeft size={20}/>
            </button>
            <div className="px-6 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">MONITORING DATE</p>
              <h4 className="text-lg font-black text-slate-900">{format(selectedDate, 'yyyy. MM. dd')}</h4>
            </div>
            <button 
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-3 hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
            >
              <ChevronRight size={20}/>
            </button>
          </div>
          <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
          <div className="hidden lg:block">
             <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Daily Collaboration Progress</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${stats.donePercent}%` }}></div>
                </div>
                <span className="text-sm font-black text-slate-900">{stats.donePercent}%</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none flex items-center gap-3 px-6 py-4 bg-indigo-50 text-indigo-700 rounded-[24px] border border-indigo-100">
            <ShieldCheck size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified by Admin</span>
              <span className="text-sm font-black">{stats.verified} / {stats.total} 건</span>
            </div>
          </div>
          {user.role === UserRole.ADMIN && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white p-4.5 rounded-[24px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`p-6 rounded-[32px] border text-left transition-all group ${selectedCategory === 'All' ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-200' : 'bg-white border-slate-200 hover:border-slate-400'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors ${selectedCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
            <CheckCircle2 size={20} />
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedCategory === 'All' ? 'text-white/40' : 'text-slate-400'}`}>전체 업무</p>
          <h4 className={`text-base font-black ${selectedCategory === 'All' ? 'text-white' : 'text-slate-900'}`}>{tasks.length}종</h4>
        </button>

        {Object.values(CategoryType).map(cat => {
          const count = tasks.filter(t => t.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-6 rounded-[32px] border text-left transition-all group ${isActive ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-200' : 'bg-white border-slate-200 hover:border-slate-400'}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                {getCategoryIcon(cat)}
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-white/40' : 'text-slate-400'}`}>{cat}</p>
              <h4 className={`text-base font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>{count}종</h4>
            </button>
          );
        })}
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-xl font-black text-slate-900">업무 상세 체크</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">근무자 완료 후 관리자가 최종 승인합니다.</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 border-2 border-slate-200 rounded"></div>
               <span className="text-[11px] font-black text-slate-400">미수행</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-indigo-500 rounded"></div>
               <span className="text-[11px] font-black text-slate-400">근무자완료</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-500 rounded"></div>
               <span className="text-[11px] font-black text-slate-400">관리자승인</span>
             </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTasks.length > 0 ? filteredTasks.map(task => {
            const status = currentDayLog[task.id] || { staffDone: false, adminVerified: false };
            const isFullyVerified = status.staffDone && status.adminVerified;
            const isPendingVerification = status.staffDone && !status.adminVerified;

            return (
              <div 
                key={task.id} 
                className={`group flex flex-col md:flex-row md:items-center justify-between p-8 transition-all hover:bg-slate-50/50 ${isFullyVerified ? 'bg-emerald-50/20' : ''}`}
              >
                <div className="flex items-center gap-6 flex-1 mb-4 md:mb-0">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 transition-all ${
                    isFullyVerified ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' :
                    isPendingVerification ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100' :
                    'bg-slate-50 text-slate-300'
                  }`}>
                    {isFullyVerified ? <ShieldCheck size={24} /> : 
                     isPendingVerification ? <Clock size={24} className="animate-pulse" /> : 
                     <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h5 className={`text-base font-black tracking-tight ${isFullyVerified ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {task.task}
                    </h5>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{task.category}</span>
                      {isPendingVerification && (
                        <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">승인 대기 중</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Step 1: Staff Done Toggle */}
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'staffDone')}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[20px] text-xs font-black border transition-all ${
                      status.staffDone 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'
                    }`}
                  >
                    <UserCheck size={16} />
                    <span>{status.staffDone ? '근무자 완료' : '완료 체크'}</span>
                  </button>

                  {/* Step 2: Admin Verified Toggle */}
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'adminVerified')}
                    disabled={!status.staffDone && user.role !== UserRole.ADMIN}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-[20px] text-xs font-black border transition-all ${
                      status.adminVerified 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-30 disabled:hover:border-slate-200'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    <span>{status.adminVerified ? '승인 완료' : '최종 승인'}</span>
                  </button>

                  {/* Delete Task (Admin Only) */}
                  {user.role === UserRole.ADMIN && (
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all ml-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-32 bg-slate-50/30">
              <div className="flex flex-col items-center gap-4 opacity-20">
                <CheckCircle2 size={64} strokeWidth={1} />
                <p className="text-xl font-black">등록된 업무가 없습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Verification Info */}
      <div className="bg-amber-50 rounded-[32px] border border-amber-100 p-8 flex items-start gap-6">
        <div className="p-4 bg-white rounded-2xl text-amber-500 shadow-sm">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-base font-black text-amber-900 tracking-tight">협업 가이드</h4>
          <p className="text-sm font-medium text-amber-700 mt-1 leading-relaxed">
            근무자는 업무를 마친 후 파란색 버튼을 눌러 완료 상태로 변경해 주세요. 관리자는 업무 내용을 직접 확인한 후 녹색 버튼을 눌러 최종 승인을 완료합니다. <br/>
            모든 업무가 승인 상태로 변경되어야 당일 업무가 공식적으로 종료됩니다.
          </p>
        </div>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">신규 업무 마스터 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">업무 카테고리</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(CategoryType).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setNewTaskCategory(cat)}
                      className={`px-5 py-4 rounded-[20px] text-sm font-black border transition-all ${newTaskCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">업무 상세 내용</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="예: 101호 청소 확인" 
                  className="w-full px-7 py-5 bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none"
                />
              </div>
            </div>
            <div className="p-10 bg-slate-50 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-500 hover:text-slate-900 transition-all">취소</button>
              <button 
                onClick={addTask}
                disabled={!newTask.trim()}
                className="flex-[2] bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                마스터 리스트에 추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
