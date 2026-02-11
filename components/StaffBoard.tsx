
import React, { useState } from 'react';
import { StaffPost, StaffComment } from '../types';
import { MessageSquare, ThumbsUp, Plus, Lightbulb, AlertTriangle, Send, MoreVertical } from 'lucide-react';

const INITIAL_POSTS: StaffPost[] = [
  {
    id: '1',
    author: '박매니저',
    title: '여름 시즌 대비 조식 메뉴 아이디어',
    content: '올해 여름에는 제철 과일을 활용한 에이드와 샌드위치를 세트로 구성해보는 게 어떨까요? 고객 만족도가 높을 것 같습니다.',
    type: 'idea',
    likes: 12,
    createdAt: '2024-05-15T10:00:00Z',
    comments: [
      { id: 'c1', author: '이알바', text: '좋은 생각이에요! 아이스 아메리카노 포함 구성도 좋을 듯합니다.', createdAt: '2024-05-15T11:30:00Z' }
    ]
  },
  {
    id: '2',
    author: '관리자',
    title: '바비큐장 이용 가이드 안내 강화 지시',
    content: '최근 바비큐장 사용 후 뒷정리가 미흡하다는 클레임이 있습니다. 체크인 시 이용 가이드를 더 상세히 안내 부탁드립니다.',
    type: 'order',
    likes: 5,
    createdAt: '2024-05-14T15:20:00Z',
    comments: []
  }
];

const StaffBoard: React.FC = () => {
  const [posts, setPosts] = useState<StaffPost[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'all' | 'idea' | 'order'>('all');

  const filteredPosts = activeTab === 'all' ? posts : posts.filter(p => p.type === activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">직원 게시판</h3>
          <p className="text-slate-500">아이디어를 공유하고 업무 지시사항을 확인하세요.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2">
          <Plus size={18} />
          글쓰기
        </button>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm inline-flex">
        {(['all', 'idea', 'order'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {tab === 'all' ? '전체' : tab === 'idea' ? '아이디어' : '업무지시'}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className={`w-2 shrink-0 ${post.type === 'idea' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${post.type === 'idea' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {post.type === 'idea' ? <Lightbulb size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{post.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{post.author} • 5시간 전</p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={20} /></button>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {post.content}
              </p>

              <div className="flex items-center gap-6 border-t border-slate-100 pt-4">
                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <ThumbsUp size={18} />
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                  <MessageSquare size={18} />
                  <span className="text-sm font-bold">{post.comments.length}</span>
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-4 space-y-3 bg-slate-50 p-4 rounded-xl">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <img src={`https://picsum.photos/30/30?random=${comment.id}`} className="w-8 h-8 rounded-full" />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-slate-800">{comment.author}</span>
                          <span className="text-[10px] text-slate-400">2시간 전</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <input 
                  type="text" 
                  placeholder="댓글을 남겨보세요..." 
                  className="flex-1 bg-slate-100 border-none rounded-xl text-xs px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-slate-800 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffBoard;
