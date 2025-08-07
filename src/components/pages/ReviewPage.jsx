import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import ReviewPost from "@/components/molecules/ReviewPost"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import reviewService from "@/services/api/reviewService"

const ReviewPage = ({ currentUser }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newReview, setNewReview] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await reviewService.getAll()
      const sortedReviews = data
        .filter(review => !review.isHidden || currentUser.grade === "admin")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setReviews(sortedReviews)
    } catch (err) {
      setError("후기를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.trim()) return

    if (newReview.length > 500) {
      toast.error("후기는 500자 이내로 작성해주세요.")
      return
    }

    setSubmitting(true)
    try {
      const reviewData = {
        content: newReview.trim(),
        authorId: currentUser.Id,
        authorName: currentUser.name,
        isHidden: false,
        createdAt: new Date().toISOString()
      }

      await reviewService.create(reviewData)
      setNewReview("")
      toast.success("후기가 등록되었습니다.")
      loadReviews()
    } catch (error) {
      toast.error("후기 등록에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReview = async (id, content) => {
    try {
      await reviewService.update(id, { content })
      toast.success("후기가 수정되었습니다.")
      loadReviews()
    } catch (error) {
      toast.error("후기 수정에 실패했습니다.")
    }
  }

  const handleDeleteReview = async (id) => {
    try {
      await reviewService.delete(id)
      toast.success("후기가 삭제되었습니다.")
      loadReviews()
    } catch (error) {
      toast.error("후기 삭제에 실패했습니다.")
    }
  }

  const handleToggleVisibility = async (id) => {
    try {
      const review = reviews.find(r => r.Id === id)
      await reviewService.update(id, { isHidden: !review.isHidden })
      toast.success(review.isHidden ? "후기가 공개되었습니다." : "후기가 숨겨졌습니다.")
      loadReviews()
    } catch (error) {
      toast.error("상태 변경에 실패했습니다.")
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="MessageCircle" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent mb-2">
              도전 후기
            </h1>
            <p className="text-gray-600">
              학습 경험과 도전 과정을 공유해주세요
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Write Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSubmitReview}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {currentUser.name?.charAt(0) || "U"}
              </div>
              
              <div className="flex-1">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                  placeholder="도전 후기나 학습 경험을 공유해주세요... (최대 500자)"
                />
                
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">
                    {newReview.length}/500
                  </span>
                  
                  <Button
                    type="submit"
                    disabled={!newReview.trim() || submitting}
                  >
                    {submitting ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        등록 중...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                        후기 등록
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Reviews List */}
        {error && (
          <Error message={error} onRetry={loadReviews} />
        )}

        {reviews.length === 0 ? (
          <Empty
            title="아직 후기가 없습니다"
            description="첫 번째 도전 후기를 작성해보세요!"
            icon="MessageCircle"
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewPost
                  review={review}
                  currentUser={currentUser}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onToggleVisibility={handleToggleVisibility}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewPage