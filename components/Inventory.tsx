
import React, { useState } from 'react';
import { InventoryCategory, InventoryItem } from '../types';
import { Package, Plus, Search, AlertCircle, ArrowUp, ArrowDown, X, Trash2, Edit3, Filter } from 'lucide-react';

const INITIAL_ITEMS: InventoryItem[] = [
  { id: '1', name: '샴푸 (대용량)', category: InventoryCategory.CONSUMABLE, quantity: 12, unit: '개', minThreshold: 5 },
  { id: '2', name: '칫솔 (일회용)', category: InventoryCategory.DISPOSABLE, quantity: 4, unit: '박스', minThreshold: 10 },
  { id: '3', name: '수건 (중형)', category: InventoryCategory.EQUIPMENT, quantity: 150, unit: '장', minThreshold: 50 },
  { id: '4', name: '바디워시', category: InventoryCategory.CONSUMABLE, quantity: 2, unit: '개', minThreshold: 8 },
  { id: '5', name: '면도기', category: InventoryCategory.DISPOSABLE, quantity: 20, unit: '개', minThreshold: 15 },
];

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<InventoryCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<InventoryCategory>(InventoryCategory.EQUIPMENT);
  const [newQty, setNewQty] = useState(0);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item));
  };

  const deleteItem = (id: string) => {
    if (window.confirm('이 품목을 삭제하시겠습니까?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const addItem = () => {
    if(!newName.trim()) return;
    const item: InventoryItem = {
      id: Math.random().toString(36).substr(2,9),
      name: newName,
      category: newCat,
      quantity: newQty,
      unit: '개',
      minThreshold: 5
    };
    setItems([...items, item]);
    setNewName('');
    setNewQty(0);
    setIsModalOpen(false);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockCount = items.filter(i => i.quantity <= i.minThreshold).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">재고 관리 센터</h3>
          <p className="text-slate-500 text-sm font-medium">불필요한 절차 없이 재고를 즉각적으로 관리하고 파악합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl border border-rose-100 flex items-center gap-3">
            <AlertCircle size={18} />
            <span className="text-xs font-black">부족 품목: {lowStockCount}건</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Plus size={18} strokeWidth={3} />
            <span>신규 품목 추가</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="품목명을 검색하세요" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <button 
              onClick={() => setFilter('All')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filter === 'All' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
            >
              전체
            </button>
            {Object.values(InventoryCategory).map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${filter === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Improved List Structure */}
        <div className="p-2 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-2">품목명</th>
                  <th className="px-6 py-2">분류</th>
                  <th className="px-6 py-2 text-center">재고 수량</th>
                  <th className="px-6 py-2">재고 상태</th>
                  <th className="px-6 py-2 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? filteredItems.map(item => {
                  const isLow = item.quantity <= item.minThreshold;
                  return (
                    <tr key={item.id} className="group transition-all">
                      <td className="px-6 py-5 bg-white border-y border-l border-slate-100 rounded-l-[24px]">
                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-300 mt-0.5">ID: {item.id}</p>
                      </td>
                      <td className="px-6 py-5 bg-white border-y border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                      </td>
                      <td className="px-6 py-5 bg-white border-y border-slate-100">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 border border-slate-100 rounded-lg hover:border-rose-100 hover:bg-rose-50 transition-all"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <div className="text-center min-w-[3rem]">
                            <span className={`text-base font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                              {item.quantity}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold ml-1">{item.unit}</span>
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500 border border-slate-100 rounded-lg hover:border-emerald-100 hover:bg-emerald-50 transition-all"
                          >
                            <ArrowUp size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-white border-y border-slate-100">
                        <div className="flex items-center gap-2">
                           {isLow ? (
                             <div className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full flex items-center gap-1.5 animate-pulse">
                               <AlertCircle size={10} />
                               <span className="text-[10px] font-black uppercase tracking-widest">부족</span>
                             </div>
                           ) : (
                             <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                               <span className="text-[10px] font-black uppercase tracking-widest">양호</span>
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-white border-y border-r border-slate-100 rounded-r-[24px] text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-20">
                         <Package size={48} strokeWidth={1} />
                         <p className="text-sm font-black">검색된 품목이 없습니다.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">신규 품목 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">품목 대분류</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(InventoryCategory).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setNewCat(cat)}
                      className={`px-4 py-4 rounded-2xl text-[11px] font-black border transition-all ${newCat === cat ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">품목 이름</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 샴푸 10L 리필" 
                  className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold focus:bg-white focus:border-slate-900 shadow-inner outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">초기 수량</label>
                  <input 
                    type="number" 
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 0)}
                    className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold focus:bg-white focus:border-slate-900 shadow-inner outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">단위</label>
                  <input 
                    type="text" 
                    placeholder="개, 박스 등"
                    className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold focus:bg-white focus:border-slate-900 shadow-inner outline-none transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-10 bg-slate-50 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-500 hover:text-slate-900 transition-all">취소</button>
              <button 
                onClick={addItem}
                disabled={!newName.trim()}
                className="flex-[2] bg-slate-900 text-white py-5 rounded-[24px] text-sm font-black shadow-2xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                리스트에 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
