import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eraser, CheckCircle, FileText, Pen } from 'lucide-react';

const SERIF = 'Georgia, "Times New Roman", serif';

export default function WaiverPage({ inquiryData, onBack }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    participantName: inquiryData?.fullName || '',
    email: inquiryData?.email || '',
    phone: inquiryData?.phone || '',
    swimmerAge: inquiryData?.swimmerAge || '',
    emergencyContact: '',
    emergencyPhone: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0c4a6e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    if (!hasSignature) setHasSignature(true);
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasSignature) return;

    setIsSubmitting(true);
    try {
      const signatureData = canvasRef.current.toDataURL('image/png');
      await fetch('https://formspree.io/f/mzdlpdzj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          signature: signatureData,
          _subject: `Signed Waiver from ${formData.participantName}`,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting waiver:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 text-center animate-slide-up">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-ocean-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ocean-900 mb-3">
            Waiver Signed Successfully!
          </h2>
          <p className="text-ocean-600 mb-8">
            Thank you! Your waiver has been submitted. We look forward to seeing you in the pool!
          </p>
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Back to Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-cyan-50 to-white">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-ocean-700 hover:text-cyan-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </button>
          <span className="font-display text-lg font-bold text-ocean-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            Waiver Form
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-[#fdfcf8] rounded-2xl shadow-2xl border-2 border-ocean-100 overflow-hidden">
          <div className="p-6 md:p-10 lg:p-14" style={{ fontFamily: SERIF }}>
            <div className="text-center border-b-2 border-ocean-200 pb-6 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-ocean-900 mb-2">
                Liability Waiver &amp; Release Form
              </h1>
              <p className="text-ocean-600 text-sm md:text-base">
                Swim with Sairy — Private Swim Instruction
              </p>
              <p className="text-ocean-400 text-xs mt-2">
                Sugar Land, Texas
              </p>
            </div>

            <div className="space-y-5 text-ocean-800 leading-relaxed text-sm md:text-base">
              <p>
                <span className="font-bold">1. Acknowledgment of Risk.</span> I, the undersigned, acknowledge that participation in swimming and aquatic activities involves inherent risks, including but not limited to drowning, slipping, diving accidents, and other serious injuries. I understand that instruction by Swim with Sairy does not eliminate these risks.
              </p>
              <p>
                <span className="font-bold">2. Release of Liability.</span> In consideration of the services provided, I hereby release, waive, discharge, and covenant not to sue Swim with Sairy, its instructors, or agents from any and all liability, claims, demands, or injuries arising from participation in swim lessons or related activities.
              </p>
              <p>
                <span className="font-bold">3. Medical Authorization.</span> In the event of an emergency, I authorize Swim with Sairy to seek medical treatment for myself or my child as deemed necessary. I agree to be financially responsible for any medical expenses incurred.
              </p>
              <p>
                <span className="font-bold">4. Swimming Ability.</span> I understand that it is my responsibility to accurately report the swimming ability and any medical conditions of the participant to the instructor prior to lessons.
              </p>
              <p>
                <span className="font-bold">5. Photo Release.</span> I grant permission to Swim with Sairy to use photographs or video taken during lessons for promotional or educational purposes, unless I provide written notice otherwise.
              </p>
              <p>
                <span className="font-bold">6. Cancellation Policy.</span> I understand that lessons must be cancelled at least 24 hours in advance to avoid being charged for the session.
              </p>
              <p className="text-xs text-ocean-500 italic">
                By signing below, I acknowledge that I have read, understood, and agree to all terms outlined in this waiver.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="border-t-2 border-ocean-200 pt-6">
                <h2 className="text-lg font-bold text-ocean-900 mb-4">Participant Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Participant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.participantName}
                      onChange={(e) => setFormData(prev => ({ ...prev, participantName: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Swimmer Age &amp; Level
                    </label>
                    <input
                      type="text"
                      value={formData.swimmerAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, swimmerAge: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ocean-800 mb-1.5">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-ocean-200 bg-white text-ocean-900 focus:outline-none focus:border-cyan-500"
                      style={{ fontFamily: SERIF }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-ocean-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-ocean-800 flex items-center gap-2">
                    <Pen className="w-4 h-4" />
                    Signature *
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="flex items-center gap-1.5 text-sm text-ocean-500 hover:text-red-500 transition-colors"
                  >
                    <Eraser className="w-4 h-4" />
                    Clear
                  </button>
                </div>
                <div className="relative rounded-lg border-2 border-ocean-200 bg-white overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                    className="w-full block cursor-crosshair"
                    style={{ height: '180px', touchAction: 'none' }}
                  />
                  {!hasSignature && (
                    <p
                      className="absolute inset-0 flex items-center justify-center text-ocean-300 text-sm pointer-events-none"
                      style={{ fontFamily: SERIF }}
                    >
                      Sign here with your mouse or finger
                    </p>
                  )}
                </div>
                <p className="text-xs text-ocean-500 mt-2" style={{ fontFamily: SERIF }}>
                  Date: {formData.date}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !hasSignature}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Signed Waiver'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
