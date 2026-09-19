import { useState } from 'react';
import { Star, MessageSquare, CheckCircle, Send } from 'lucide-react';

export default function ReviewSection() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({ name: '', review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('https://formspree.io/f/xwlpvvwb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          rating: rating,
          review: formData.review,
          _subject: `New Review from ${formData.name} (${rating} stars)`,
        }),
      });
      setSubmitted(true);
      setFormData({ name: '', review: '' });
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <section id="review" className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4" />
            Share Your Experience
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ocean-900 mb-4">
            Leave a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-ocean-600"> Review</span>
          </h2>
          <p className="text-lg text-ocean-700">
            Had a great experience? Let other families know about it!
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-ocean-100">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-ocean-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold text-ocean-900 mb-3">
                Thank You for Your Review!
              </h3>
              <p className="text-ocean-600 mb-6">
                Your feedback means the world to us. It helps other families discover the joy of swimming.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-cyan-600 hover:text-cyan-700 font-medium underline"
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-ocean-900 mb-3">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= displayRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-ocean-100 text-ocean-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-ocean-600">
                    {displayRating} of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-900 mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-ocean-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ocean-900 mb-2">Your Review *</label>
                <textarea
                  required
                  value={formData.review}
                  onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-ocean-200 focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Share your experience with Swim with Sairy..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-600 hover:to-ocean-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
