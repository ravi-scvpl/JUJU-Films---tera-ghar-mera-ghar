/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, 
  Play, 
  ChevronRight, 
  Bell, 
  Share2, 
  Home as HomeIcon, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Search,
  User,
  Info,
  ChevronLeft,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AmanImg from './assests/Aman.png';
import AshaImg from './assests/Asha.png';

// --- Types ---
type EmotionalState = 'The Decision' | 'The Conflict' | 'The Sacrifice' | 'The Temptation' | 'The Fulfillment';

interface Episode {
  id: number;
  title: string;
  hook: string;
  synopsis: string;
  thumbnail: string;
  poster: string;
  videoUrl: string;
  duration: string;
  emotionalState: EmotionalState;
  isTrending?: boolean;
  isNew?: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  thumbnail: string;
}

// --- Mock Data ---
const EPISODES: Episode[] = [
  {
    id: 1,
    title: "Anniversary ya Adjustment?",
    hook: "Aman aur Asha ki 3rd anniversary: Ek fancy dinner ya tapakti chhat?",
    synopsis: "Eve of Aman and Asha’s third anniversary. Their rented house in Kanpur is falling apart. When Aman gets news of his ancestral land, a vague 'someday' turns into 'abhi nahi toh kabhi nahi'. But there's a bigger twist: Asha is pregnant.",
    thumbnail: AmanImg,
    poster: AmanImg,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "45s",
    emotionalState: 'The Decision',
    isTrending: true,
    isNew: true
  },
  {
    id: 11,
    title: "Hamare Time Mein...",
    hook: "Jab ghar ki neev mein bade-buzurgon ki purani soch takrayi modern sapno se.",
    synopsis: "Construction begins, but so does the family drama. Elders push for speed and tradition, while Asha insists on safety for the baby. Aman is caught in the middle. Can the BuildXpert engineer bridge the gap between 'nazar' and soil testing?",
    thumbnail: AshaImg,
    poster: AshaImg,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "52s",
    emotionalState: 'The Conflict',
    isTrending: true
  },
  {
    id: 21,
    title: "YouTube vs EMI",
    hook: "Jab paise kam pade, toh kya Asha ka YouTube channel banega ghar ka sahara?",
    synopsis: "The middle phase is the hardest. Money is tight, and decision fatigue sets in. Asha’s channel starts growing, creating a new tension: can a house depend on an unpredictable online income? Aman must learn to trust Asha's agency.",
    thumbnail: AshaImg,
    poster: AshaImg,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "38s",
    emotionalState: 'The Sacrifice',
    isNew: true
  },
  {
    id: 31,
    title: "Sasta Flat ya Apna Ghar?",
    hook: "Rana ne diya ek seductive offer: Zameen becho, ready-made flat lo. Kya Aman bhatak jayega?",
    synopsis: "Exhaustion peaks. A friend offers a 'ready-to-move' 4BHK flat. For Aman, it's relief; for Asha, it's betrayal. The BuildXpert friend must help Aman see that leadership isn't about switching paths when things get hard.",
    thumbnail: AmanImg,
    poster: AmanImg,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "60s",
    emotionalState: 'The Temptation'
  },
  {
    id: 41,
    title: "Griha Pravesh aur Naya Mehmaan",
    hook: "MasterChef Mumbai ya Kanpur ka Griha Pravesh? Asha ke sapno ki sabse badi pariksha.",
    synopsis: "The deadline is fixed. Asha gets a call for MasterChef Mumbai. As she leaves, Aman must shoulder the final hustle alone. In a poetic convergence, a baby girl arrives just in time for the housewarming. Permanence earned.",
    thumbnail: AshaImg,
    poster: AshaImg,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "55s",
    emotionalState: 'The Fulfillment'
  }
];

const POLLS: Poll[] = [
  {
    id: 1,
    question: "Aman ko kya chunna chahiye?",
    options: [
      { id: 'a', text: "Ancestral Land par ghar", votes: 1240 },
      { id: 'b', text: "Posh area mein ready flat", votes: 850 }
    ]
  },
  {
    id: 2,
    question: "Ghar ki neev ke liye kya zaroori hai?",
    options: [
      { id: 'a', text: "Buzurgon ka tajurba", votes: 980 },
      { id: 'b', text: "Soil testing & Engineering", votes: 1560 }
    ]
  }
];

const QUIZZES: Quiz[] = [
  {
    id: 1,
    title: "Ghar Banane ka Gyan",
    description: "Kya aap jaante hain mazboot ghar ka raaz?",
    thumbnail: AmanImg,
    questions: [
      {
        question: "Cement ki quality check karne ka sahi tareeka kya hai?",
        options: ["Rung dekh kar", "Paani mein daal kar", "Manufacturing date dekh kar", "Sabhi"],
        correctIndex: 3
      },
      {
        question: "Ghar ki mazbooti ke liye sabse zaroori kya hai?",
        options: ["Sasta material", "Sahi technical salah", "Sirf sundar design", "Jaldi kaam khatam karna"],
        correctIndex: 1
      }
    ]
  }
];

// --- Components ---

const WhatsAppButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const handleClick = () => {
    const message = encodeURIComponent("Namaste! Mujhe 'Tera Ghar Mera Ghar' series dekhni hai. Aman aur Asha ki kahani dikhaiye.");
    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:brightness-110 transition-all active:scale-95 ${className}`}
    >
      <MessageCircle size={20} fill="white" />
      <span>{text}</span>
    </button>
  );
};

const EpisodeCard = ({ episode, onClick }: { episode: Episode, onClick: () => void, key?: React.Key }) => (
  <div 
    onClick={onClick}
    className="relative min-w-[140px] w-[140px] h-[200px] rounded-lg overflow-hidden shadow-lg cursor-pointer group flex-shrink-0 active:scale-95 transition-all"
  >
    <img 
      src={episode.thumbnail} 
      alt={episode.title} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-3 flex flex-col justify-end">
      <div className="flex items-center gap-1 text-[10px] text-white/70 mb-1">
        <Clock size={10} />
        <span>{episode.duration}</span>
      </div>
      <h4 className="text-white text-xs font-bold leading-tight line-clamp-2">{episode.title}</h4>
      {episode.isNew && (
        <div className="absolute top-2 left-2 bg-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">New</div>
      )}
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string, icon?: any, subtitle?: string }) => (
  <div className="px-4 mb-3 flex flex-col">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-orange-500" />}
      <h2 className="text-lg font-bold tracking-tight text-white/90">{title}</h2>
    </div>
    {subtitle && <p className="text-[10px] text-white/40 mt-0.5">{subtitle}</p>}
  </div>
);

const PollCard = ({ poll }: { poll: Poll, key?: React.Key }) => {
  const [voted, setVoted] = useState<string | null>(null);
  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0) + (voted ? 1 : 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[280px] w-[280px] flex-shrink-0">
      <h3 className="font-bold text-sm mb-4 leading-tight">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((opt) => {
          const percentage = Math.round(((opt.votes + (voted === opt.id ? 1 : 0)) / totalVotes) * 100);
          return (
            <button
              key={opt.id}
              disabled={!!voted}
              onClick={() => setVoted(opt.id)}
              className={`relative w-full p-3 rounded-lg text-xs font-bold text-left transition-all overflow-hidden ${
                voted === opt.id ? 'bg-orange-600/20 border border-orange-500' : 'bg-white/5 border border-white/5'
              }`}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-white/10 transition-all duration-1000" 
                style={{ width: voted ? `${percentage}%` : '0%' }} 
              />
              <div className="relative flex justify-between items-center">
                <span>{opt.text}</span>
                {voted && <span className="text-[10px] opacity-60">{percentage}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[8px] text-white/30 mt-4 uppercase tracking-widest font-bold">
        {voted ? "Thanks for voting!" : `${totalVotes} people voted`}
      </p>
    </div>
  );
};

const QuizCard = ({ quiz, onClick }: { quiz: Quiz, onClick: () => void, key?: React.Key }) => (
  <div 
    onClick={onClick}
    className="relative min-w-[240px] w-[240px] h-[140px] rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0 border border-white/10 active:scale-95 transition-all"
  >
    <img src={quiz.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-4 flex flex-col justify-end">
      <div className="flex items-center gap-1 text-[8px] font-black text-orange-500 uppercase mb-1">
        <Star size={10} fill="currentColor" />
        <span>Interactive Quiz</span>
      </div>
      <h4 className="text-white text-sm font-bold leading-tight">{quiz.title}</h4>
      <p className="text-white/60 text-[10px] line-clamp-1 mt-1">{quiz.description}</p>
    </div>
  </div>
);

const QuizModal = ({ quiz, onClose }: { quiz: Quiz, onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    if (idx === quiz.questions[currentStep].correctIndex) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentStep < quiz.questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[150] bg-[#0a0a0a] flex flex-col p-6"
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          {showResult ? "Result" : `Question ${currentStep + 1} of ${quiz.questions.length}`}
        </div>
        <div className="w-10" />
      </div>

      {!showResult ? (
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase italic leading-tight">
            {quiz.questions[currentStep].question}
          </h2>
          <div className="space-y-3">
            {quiz.questions[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={`w-full p-5 rounded-2xl text-left font-bold transition-all border ${
                  selectedOption === idx 
                    ? idx === quiz.questions[currentStep].correctIndex 
                      ? 'bg-green-500/20 border-green-500 text-green-500' 
                      : 'bg-red-500/20 border-red-500 text-red-500'
                    : selectedOption !== null && idx === quiz.questions[currentStep].correctIndex
                      ? 'bg-green-500/20 border-green-500 text-green-500'
                      : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-orange-600/40">
            <Star size={48} fill="white" />
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">Shandaar!</h2>
          <p className="text-white/60 mb-8">Aapne {score} out of {quiz.questions.length} sahi jawaab diye.</p>
          <button 
            onClick={onClose}
            className="bg-white text-black font-black py-4 px-12 rounded-full uppercase tracking-widest text-xs active:scale-95 transition-all"
          >
            Back to Home
          </button>
        </div>
      )}
    </motion.div>
  );
};

// --- Views ---

const HomeView = ({ onEpisodeSelect, continueWatching, emotionalState, onQuizSelect, onShowToast }: { 
  onEpisodeSelect: (id: number) => void, 
  continueWatching: Episode | null,
  emotionalState: EmotionalState | null,
  onQuizSelect: (quiz: Quiz) => void,
  onShowToast: (msg: string) => void
}) => {
  const featured = EPISODES[0];
  
  const recommended = useMemo(() => {
    if (!emotionalState) return EPISODES.slice(1);
    return EPISODES.filter(e => e.emotionalState === emotionalState).concat(EPISODES.filter(e => e.emotionalState !== emotionalState));
  }, [emotionalState]);

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <div className="relative w-full aspect-[9/12] sm:aspect-[16/9] overflow-hidden">
        <img 
          src={AmanImg} 
          alt="Aman" 
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <h1 className="text-4xl font-black mb-2 text-shadow-premium uppercase tracking-tighter italic leading-none">Aman & Asha ki Kahani</h1>
          <p className="text-sm text-white/80 mb-6 line-clamp-2 max-w-xs mx-auto">Anniversary chaos se Griha Pravesh tak ka emotional safar.</p>
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={() => onEpisodeSelect(featured.id)}
              className="bg-white text-black font-bold py-2.5 px-8 rounded flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all"
            >
              <Play size={20} fill="black" />
              <span>Watch Now</span>
            </button>
            <button 
              onClick={() => onEpisodeSelect(featured.id)}
              className="bg-white/20 backdrop-blur-md text-white p-2.5 rounded hover:bg-white/30 active:scale-95 transition-all"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactions Section */}
      <div className="mt-8">
        <SectionHeader title="Aapki Rai" subtitle="Polls & Quizzes" icon={MessageCircle} />
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {POLLS.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
          {QUIZZES.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} onClick={() => onQuizSelect(quiz)} />
          ))}
        </div>
      </div>

      {/* Meet the Characters */}
      <div className="mt-8 px-4">
        <SectionHeader title="Meet Aman & Asha" icon={User} />
        <div className="flex gap-4">
          <div 
            onClick={() => onShowToast("Aman: The Visionary. Sapno ka ghar banane ki zid.")}
            className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center text-center active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-orange-500">
              <img src={AmanImg} alt="Aman" className="w-full h-full object-cover object-top" />
            </div>
            <h3 className="font-bold text-sm">Aman</h3>
            <p className="text-[10px] text-white/50">The Visionary</p>
          </div>
          <div 
            onClick={() => onShowToast("Asha: The Foundation. Pragmatic and strong.")}
            className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col items-center text-center active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-orange-500">
              <img src={AshaImg} alt="Asha" className="w-full h-full object-cover object-top" />
            </div>
            <h3 className="font-bold text-sm">Asha</h3>
            <p className="text-[10px] text-white/50">The Foundation</p>
          </div>
        </div>
      </div>

      {/* Continue Watching */}
      {continueWatching && (
        <div className="mt-8">
          <SectionHeader title="Continue Watching" icon={Clock} />
          <div className="px-4">
            <div 
              onClick={() => onEpisodeSelect(continueWatching.id)}
              className="relative w-full h-24 bg-slate-800 rounded-lg overflow-hidden flex cursor-pointer group active:scale-[0.98] transition-all"
            >
              <img src={continueWatching.thumbnail} alt="" className="w-32 h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={24} fill="white" />
              </div>
              <div className="p-3 flex flex-col justify-center flex-1">
                <h4 className="font-bold text-sm">{continueWatching.title}</h4>
                <p className="text-[10px] text-white/60">Episode {continueWatching.id} • {continueWatching.duration}</p>
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending */}
      <div className="mt-8">
        <SectionHeader title="Trending Now" icon={TrendingUp} />
        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar">
          {EPISODES.filter(e => e.isTrending).map(ep => (
            <EpisodeCard key={ep.id} episode={ep} onClick={() => onEpisodeSelect(ep.id)} />
          ))}
        </div>
      </div>

      {/* Recommended For You */}
      <div className="mt-8">
        <SectionHeader title={emotionalState ? `Best for ${emotionalState}` : "Recommended For You"} icon={Star} />
        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar">
          {recommended.map(ep => (
            <EpisodeCard key={ep.id} episode={ep} onClick={() => onEpisodeSelect(ep.id)} />
          ))}
        </div>
      </div>

      {/* Latest Episodes */}
      <div className="mt-8">
        <SectionHeader title="Latest Episodes" />
        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar">
          {EPISODES.filter(e => e.isNew).map(ep => (
            <EpisodeCard key={ep.id} episode={ep} onClick={() => onEpisodeSelect(ep.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailView = ({ episode, onPlay, onBack, onToggleWatchlist, isWatchlisted, onShare }: { 
  episode: Episode, 
  onPlay: () => void, 
  onBack: () => void,
  onToggleWatchlist: () => void,
  isWatchlisted: boolean,
  onShare: () => void
}) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
  >
    <div className="relative w-full aspect-video">
      <img src={episode.poster} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-95 transition-all">
        <ChevronLeft size={24} />
      </button>
    </div>
    
      <div className="px-6 -mt-12 relative">
      <h1 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">{episode.title}</h1>
      <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 mb-6">
        <span className="bg-white/10 px-2 py-0.5 rounded">HD</span>
        <span>{episode.duration}</span>
        <span>{episode.emotionalState}</span>
        <span className="text-orange-500">JK Super Cement</span>
      </div>
      
      <button 
        onClick={onPlay}
        className="w-full bg-white text-black font-black py-3 rounded flex items-center justify-center gap-2 mb-6 active:scale-95 transition-all"
      >
        <Play size={20} fill="black" />
        <span>PLAY EPISODE</span>
      </button>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={onToggleWatchlist}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg active:scale-95 transition-all ${isWatchlisted ? 'bg-orange-600 text-white' : 'bg-white/5 text-white'}`}
        >
          <Bookmark size={20} fill={isWatchlisted ? "white" : "none"} />
          <span className="text-[10px] font-bold">{isWatchlisted ? "Saved" : "Watchlist"}</span>
        </button>
        <button 
          onClick={onShare}
          className="flex-1 flex flex-col items-center gap-1 py-3 bg-white/5 rounded-lg active:scale-95 transition-all"
        >
          <Share2 size={20} />
          <span className="text-[10px] font-bold">Share</span>
        </button>
      </div>
      
      <p className="text-white/70 text-sm leading-relaxed mb-8">
        {episode.synopsis}
      </p>
      
      <div className="border-t border-white/10 pt-8 mb-12">
        <h3 className="text-lg font-bold mb-4">Up Next</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {EPISODES.filter(e => e.id !== episode.id).map(ep => (
            <div 
              key={ep.id} 
              onClick={() => onPlay()} 
              className="min-w-[200px] bg-slate-800/50 rounded-lg overflow-hidden active:scale-95 transition-all cursor-pointer"
            >
              <img src={ep.poster} alt="" className="w-full aspect-video object-cover" />
              <div className="p-3">
                <h4 className="font-bold text-xs line-clamp-1">{ep.title}</h4>
                <p className="text-[10px] text-white/40 mt-1">Episode {ep.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const PlayerView = ({ episodes, initialIndex, onClose, onToggleLike, likedEpisodes, onShare }: { 
  episodes: Episode[], 
  initialIndex: number, 
  onClose: () => void,
  onToggleLike: (id: number) => void,
  likedEpisodes: number[],
  onShare: (ep: Episode) => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentEpisode = episodes[currentIndex];
  const isLiked = likedEpisodes.includes(currentEpisode.id);

  const handleNext = () => {
    if (currentIndex < episodes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full active:scale-95 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <p className="text-white text-[10px] font-black uppercase tracking-widest italic">Tera Ghar Mera Ghar</p>
          <p className="text-white/60 text-[8px]">EPISODE {currentIndex + 1}</p>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="text-white p-2 bg-black/20 backdrop-blur-md rounded-full active:scale-95 transition-all">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <video 
          key={currentEpisode.videoUrl}
          ref={videoRef}
          src={currentEpisode.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        
        {/* Interaction Sidebar */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
          <button 
            onClick={() => onToggleLike(currentEpisode.id)}
            className="flex flex-col items-center gap-1 active:scale-95 transition-all"
          >
            <div className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white'}`}>
              <Heart size={20} fill={isLiked ? "white" : "none"} />
            </div>
            <span className="text-white text-[8px] font-bold">{isLiked ? '12.5k' : '12.4k'}</span>
          </button>
          <button className="flex flex-col items-center gap-1 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
              <MessageCircle size={20} />
            </div>
            <span className="text-white text-[8px] font-bold">842</span>
          </button>
          <button 
            onClick={() => onShare(currentEpisode)}
            className="flex flex-col items-center gap-1 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
              <Share2 size={20} />
            </div>
            <span className="text-white text-[8px] font-bold">Share</span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-[8px]">JK</div>
            <span className="text-white text-[10px] font-bold">JK Super Cement</span>
          </div>
          <h3 className="text-white font-black text-xl mb-1 italic tracking-tighter uppercase">{currentEpisode.title}</h3>
          <p className="text-white/80 text-xs line-clamp-2 mb-6">{currentEpisode.hook}</p>
          
          <div className="flex gap-3">
            <WhatsAppButton text="Get Next on WhatsApp" className="flex-1 py-2.5 text-xs rounded" />
          </div>
        </div>

        {/* Navigation Overlays */}
        <div className="absolute inset-y-0 left-0 w-1/4" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/4" onClick={handleNext} />
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10 w-full flex">
        {episodes.map((_, idx) => (
          <div 
            key={idx} 
            className={`flex-1 h-full mx-[1px] transition-all duration-500 ${idx === currentIndex ? 'bg-orange-600' : idx < currentIndex ? 'bg-white/40' : 'bg-white/10'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (state: EmotionalState) => void }) => {
  const options: { label: string, value: EmotionalState, desc: string }[] = [
    { label: "Abhi shuruat hai", value: 'The Decision', desc: "Decision to build & pregnancy twist" },
    { label: "Ghar aur Gharwale", value: 'The Conflict', desc: "Family conflicts & belief systems" },
    { label: "Mushkil raasta", value: 'The Sacrifice', desc: "Money pressure & lifestyle sacrifices" },
    { label: "Sahi faisla", value: 'The Temptation', desc: "Flat vs House: The ultimate test" },
    { label: "Sapna sach hone wala hai", value: 'The Fulfillment', desc: "MasterChef dream & Griha Pravesh" }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full"
      >
        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-8 shadow-2xl shadow-orange-600/20 mx-auto">JK</div>
        <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase italic">Aapka sapna kis mod par hai?</h2>
        <p className="text-white/50 text-sm mb-10">Aman aur Asha ki kahani ke uss hisse se shuru karein jo aapke dil ke kareeb hai.</p>
        
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onComplete(opt.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-orange-500 hover:bg-white/10 p-4 rounded-xl transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white group-hover:text-orange-500">{opt.label}</span>
                <ChevronRight size={16} className="text-white/30 group-hover:text-orange-500" />
              </div>
              <p className="text-[10px] text-white/40">{opt.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'detail' | 'player' | 'watchlist' | 'trending'>('home');
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [continueWatchingId, setContinueWatchingId] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [likedEpisodes, setLikedEpisodes] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('tm_emotional_state') as EmotionalState;
    const savedContinue = localStorage.getItem('continueWatching');
    const savedWatchlist = localStorage.getItem('tm_watchlist');
    const savedLikes = localStorage.getItem('tm_likes');
    
    if (savedState) setEmotionalState(savedState);
    else setShowOnboarding(true);

    if (savedContinue) setContinueWatchingId(parseInt(savedContinue));
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedLikes) setLikedEpisodes(JSON.parse(savedLikes));
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleWatchlist = (id: number) => {
    const newWatchlist = watchlist.includes(id) 
      ? watchlist.filter(i => i !== id) 
      : [...watchlist, id];
    setWatchlist(newWatchlist);
    localStorage.setItem('tm_watchlist', JSON.stringify(newWatchlist));
    setToast(watchlist.includes(id) ? "Removed from Watchlist" : "Added to Watchlist");
  };

  const toggleLike = (id: number) => {
    const newLikes = likedEpisodes.includes(id)
      ? likedEpisodes.filter(i => i !== id)
      : [...likedEpisodes, id];
    setLikedEpisodes(newLikes);
    localStorage.setItem('tm_likes', JSON.stringify(newLikes));
  };

  const handleShare = async (episode: Episode) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: episode.title,
          text: episode.hook,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      setToast("Link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleEpisodeSelect = (id: number) => {
    setSelectedEpisodeId(id);
    setView('detail');
  };

  const handlePlay = () => {
    setView('player');
    if (selectedEpisodeId) {
      localStorage.setItem('continueWatching', selectedEpisodeId.toString());
      setContinueWatchingId(selectedEpisodeId);
    }
  };

  const handleOnboardingComplete = (state: EmotionalState) => {
    setEmotionalState(state);
    localStorage.setItem('tm_emotional_state', state);
    setShowOnboarding(false);
  };

  const selectedEpisode = EPISODES.find(e => e.id === selectedEpisodeId) || EPISODES[0];
  const continueWatchingEpisode = EPISODES.find(e => e.id === continueWatchingId) || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-6 py-3 rounded-full font-bold text-xs shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className="h-6 flex items-center justify-center">
            <div className="bg-orange-600 text-white font-black px-2 py-0.5 rounded text-[10px] italic tracking-tighter">JUJU</div>
          </div>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <span className="font-black text-white italic tracking-tighter uppercase text-sm">Tera Ghar Mera Ghar</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setToast("Search coming soon!")} className="active:scale-95 transition-all">
            <Search size={20} className="text-white/70" />
          </button>
          <button onClick={() => setToast("Profile coming soon!")} className="active:scale-95 transition-all">
            <User size={20} className="text-white/70" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {view === 'home' && (
          <HomeView 
            onEpisodeSelect={handleEpisodeSelect} 
            continueWatching={continueWatchingEpisode}
            emotionalState={emotionalState}
            onQuizSelect={setActiveQuiz}
            onShowToast={setToast}
          />
        )}
        {view === 'watchlist' && (
          <div className="pt-24 px-4 pb-24">
            <SectionHeader title="My Watchlist" icon={Bookmark} subtitle="Saved for later" />
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {EPISODES.filter(e => watchlist.includes(e.id)).map(ep => (
                  <EpisodeCard key={ep.id} episode={ep} onClick={() => handleEpisodeSelect(ep.id)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Bookmark size={48} className="mb-4" />
                <p className="text-sm">Your watchlist is empty</p>
              </div>
            )}
          </div>
        )}
        {view === 'trending' && (
          <div className="pt-24 px-4 pb-24">
            <SectionHeader title="Trending Now" icon={TrendingUp} subtitle="What everyone is watching" />
            <div className="grid grid-cols-2 gap-4">
              {EPISODES.filter(e => e.isTrending).map(ep => (
                <EpisodeCard key={ep.id} episode={ep} onClick={() => handleEpisodeSelect(ep.id)} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] glass-morphism px-8 py-4 flex justify-between items-center border-t border-white/5">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${view === 'home' ? 'text-orange-500' : 'text-white/40'}`}>
          <HomeIcon size={20} />
          <span className="text-[8px] font-bold uppercase">Home</span>
        </button>
        <button onClick={() => setView('trending')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${view === 'trending' ? 'text-orange-500' : 'text-white/40'}`}>
          <TrendingUp size={20} />
          <span className="text-[8px] font-bold uppercase">Trending</span>
        </button>
        <button onClick={() => setView('watchlist')} className={`flex flex-col items-center gap-1 active:scale-95 transition-all ${view === 'watchlist' ? 'text-orange-500' : 'text-white/40'}`}>
          <Bookmark size={20} />
          <span className="text-[8px] font-bold uppercase">Watchlist</span>
        </button>
        <button onClick={() => setToast("No new updates")} className="flex flex-col items-center gap-1 text-white/40 active:scale-95 transition-all">
          <Bell size={20} />
          <span className="text-[8px] font-bold uppercase">Updates</span>
        </button>
      </nav>

      {/* Overlays */}
      <AnimatePresence>
        {view === 'detail' && selectedEpisode && (
          <DetailView 
            episode={selectedEpisode} 
            onPlay={handlePlay} 
            onBack={() => setView('home')}
            onToggleWatchlist={() => toggleWatchlist(selectedEpisode.id)}
            isWatchlisted={watchlist.includes(selectedEpisode.id)}
            onShare={() => handleShare(selectedEpisode)}
          />
        )}
        {view === 'player' && selectedEpisode && (
          <PlayerView 
            episodes={EPISODES} 
            initialIndex={EPISODES.findIndex(e => e.id === selectedEpisodeId)} 
            onClose={() => setView('detail')}
            onToggleLike={toggleLike}
            likedEpisodes={likedEpisodes}
            onShare={handleShare}
          />
        )}
        {showOnboarding && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        {activeQuiz && (
          <QuizModal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Bubble */}
      {view === 'home' && (
        <button 
          onClick={() => window.open('https://wa.me/919999999999', '_blank')}
          className="fixed bottom-24 right-4 z-[55] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20 active:scale-95 transition-all"
        >
          <MessageCircle size={28} fill="white" className="text-white" />
        </button>
      )}
    </div>
  );
}
