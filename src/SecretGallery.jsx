import { useState } from 'react';
import { ArrowLeft, X, Lock, Key, AlertCircle } from 'lucide-react';

const GALLERY_PHOTOS = [
  {
    src: 'https://images.pexels.com/photos/32418615/pexels-photo-32418615.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'First Splashes',
    body: 'Every swimmer starts somewhere. For most kids, the very first lesson is simply learning to feel comfortable in the water. We begin with gentle splashes, blowing bubbles, and games that make the pool feel like a second home. The fear melts away faster than you would think — sometimes in a single session.',
  },
  {
    src: 'https://images.pexels.com/photos/346777/pexels-photo-346777.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Finding Balance',
    body: 'Floating is the foundation of every stroke. Once a student trusts the water to hold them up, everything else follows. We practice star floats, pencil floats, and superman glides until the feeling of weightlessness becomes second nature. It is usually the moment a nervous swimmer realizes they are safe that the real progress begins.',
  },
  {
    src: 'https://images.pexels.com/photos/31522680/pexels-photo-31522680.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Guided Practice',
    body: 'One-on-one instruction means every correction is tailored to the individual. A small adjustment to arm angle or head position can unlock a stroke that felt impossible minutes before. The look of surprise on a student\'s face when something finally clicks is one of the best parts of coaching.',
  },
  {
    src: 'https://images.pexels.com/photos/346780/pexels-photo-346780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Building Trust',
    body: 'For younger swimmers, trust is everything. Lessons move at their pace, with plenty of encouragement and never any pressure. We celebrate every small victory — a face in the water, a three-second float, a first unassisted kick. Confidence grows one breakthrough at a time.',
  },
  {
    src: 'https://images.pexels.com/photos/2250432/pexels-photo-2250432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Kick and Glide',
    body: 'The kickboard is a swim coach\'s best friend. It isolates the legs so students can focus on a strong, steady flutter kick without worrying about arms or breathing. Once the kick is solid, we add the arms, then the breathing — building the full stroke piece by piece in a way that never feels overwhelming.',
  },
  {
    src: 'https://images.pexels.com/photos/3775140/pexels-photo-3775140.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Adult Confidence',
    body: 'It is never too late to learn. Adult students often arrive with years of water anxiety, and the journey to overcome that is deeply personal. We start in the shallow end, progress at a pace that feels safe, and build skills that last a lifetime. Seeing an adult swim their first full lap is one of the most rewarding moments in coaching.',
  },
  {
    src: 'https://images.pexels.com/photos/9617722/pexels-photo-9617722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Team Spirit',
    body: 'Swimming is usually a solo sport, but the energy of training alongside others is contagious. Group sessions push everyone to work a little harder and cheer a little louder. The friendships formed at the pool often outlast the season.',
  },
  {
    src: 'https://images.pexels.com/photos/8688139/pexels-photo-8688139.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Stroke Refinement',
    body: 'For advanced swimmers, the difference between good and great lives in the details. Hand entry angle, catch depth, body rotation, timing of the breath — tiny adjustments that shave seconds off a lap. We use drills, repetition, and video analysis to dial in technique until it is effortless.',
  },
  {
    src: 'https://images.pexels.com/photos/5278447/pexels-photo-5278447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'Underwater Joy',
    body: 'There is a special kind of joy that comes from being completely submerged — the silence, the weightlessness, the feeling of flying. For kids especially, underwater games and challenges turn practice into adventure. The pool becomes a world of its own, and the skills stick because they are having too much fun to notice they are learning.',
  },
  {
    src: 'https://images.pexels.com/photos/30642812/pexels-photo-30642812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    caption: 'The Freestyle Flow',
    body: 'Freestyle is the stroke every swimmer returns to. Long, smooth, rhythmic — when it clicks, it feels like the water is doing the work for you. We spend hours on catch-and-pull drills, rotation, and breathing timing so that the stroke becomes automatic. The goal is a swimmer who can swim laps without thinking about the mechanics at all.',
  },
];

function PhotoDetailModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ocean-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ocean-800" />
          </button>
          <div className="aspect-[16/10] overflow-hidden rounded-t-3xl">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ocean-900 mb-4">
            {photo.caption}
          </h2>
          <p className="text-ocean-700 leading-relaxed text-base">
            {photo.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PasswordModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'pleaseopenthedoor') {
      setPassword('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ocean-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 hover:bg-ocean-50 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-ocean-600" />
        </button>

        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h3 className="font-display text-2xl font-bold text-ocean-900 mb-2 text-center">
          Secret Page
        </h3>
        <p className="text-ocean-600 text-sm text-center mb-6">
          Enter the password to access the hidden gallery.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Key className="w-5 h-5 text-ocean-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Password"
              autoFocus
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 text-ocean-900 font-medium focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Access Denied.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.99]"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SecretGallery({ onBack }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-white">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-ocean-700 hover:text-cyan-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </button>
          <span className="font-display text-lg font-bold text-ocean-900">
            Secret Gallery
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ocean-900 mb-4">
            Behind the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-ocean-600"> Scenes</span>
          </h1>
          <p className="text-lg text-ocean-700 max-w-2xl mx-auto">
            A secret collection of moments from lessons, practice, and the journey in between.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {GALLERY_PHOTOS.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedPhoto(photo)}
              className="group text-left"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-ocean-100 hover:border-cyan-300 bg-white">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display font-bold text-ocean-900 text-sm leading-snug">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
