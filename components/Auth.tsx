
import React, { useState } from 'react';
import { UserRole, UserInfo } from '../types';
import { Hotel, ShieldCheck, User, ArrowRight, Key } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserInfo) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [pensionName, setPensionName] = useState('오션뷰 펜션');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 초대 코드 검증 (모의 데이터: STAFF인 경우 '123456'만 허용)
    if (!isLogin && role === UserRole.STAFF && inviteCode !== '123456') {
      alert('유효하지 않은 초대 코드입니다. 관리자에게 문의하세요.');
      return;
    }

    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name || (isLogin ? '홍길동' : '신규 사용자'),
      role: isLogin ? (name === '스태프' ? UserRole.STAFF : UserRole.ADMIN) : role,
      pensionName: pensionName
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
        <div className="p-10 text-center space-y-4">
          <div className="inline-flex p-4 bg-slate-900 text-white rounded-[24px] mb-2">
            <Hotel size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">PensionEase</h1>
          <p className="text-slate-400 font-medium">펜션 통합 관리 시스템에 오신 것을 환영합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-6">
          {!isLogin && (
            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
              <button 
                type="button"
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.ADMIN ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                <ShieldCheck size={18} /> 관리자
              </button>
              <button 
                type="button"
                onClick={() => setRole(UserRole.STAFF)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === UserRole.STAFF ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                <User size={18} /> 사용자
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">이름</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함을 입력하세요"
                className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
              />
            </div>

            {!isLogin && role === UserRole.STAFF && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-[11px] font-black text-rose-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Key size={12} /> 초대 코드 (관리자 전용)
                </label>
                <input 
                  type="text" 
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="6자리 코드를 입력하세요"
                  className="w-full px-6 py-4 bg-rose-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-rose-500 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-bold text-base flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            {isLogin ? '로그인하기' : '회원가입 완료'}
            <ArrowRight size={20} />
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있습니다. 로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
