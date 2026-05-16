import { useState } from 'react'
import { toast } from 'sonner'

export default function RatingModal({ open, onClose }) {

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()

    toast.success('Thank you for your feedback ✨')

    setRating(0)
    setFeedback('')

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="text-3xl font-serif text-center text-gray-900 mb-2">
          Rate Your Experience
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Your feedback helps us improve Mystique Fragrance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Stars */}
          <div className="flex justify-center gap-3">

            {[1, 2, 3, 4, 5].map((star) => (

              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition duration-200 ${
                  rating >= star
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              >
                ★
              </button>

            ))}

          </div>

          {/* Feedback */}
          <div>

            <textarea
              rows={5}
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-full bg-indigo-700 px-6 py-2 text-white hover:bg-indigo-600 transition"
            >
              Submit
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}