import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import VideoCard from "@/components/molecules/VideoCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import videoService from "@/services/api/videoService"

const MembershipPage = ({ currentUser, onUpload, onEdit }) => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await videoService.getAll()
      const membershipVideos = data
        .filter(video => video.section === "membership")
        .sort((a, b) => {
          // Pinned videos first
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          // Then by creation date
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
      
      setVideos(membershipVideos)
    } catch (err) {
      setError("동영상을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const canUpload = () => {
    return currentUser.grade === "admin"
  }

  if (loading) {
    return <Loading type="grid" />
  }

  if (error) {
    return <Error message={error} onRetry={loadVideos} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  멤버십 강의
                </h1>
                <p className="text-gray-600 mt-1">
                  멤버를 위한 전문 강의 콘텐츠
                </p>
              </div>
            </div>

            {canUpload() && (
              <Button onClick={onUpload} size="lg">
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                동영상 업로드
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {videos.length === 0 ? (
          <Empty
            title="멤버십 강의가 없습니다"
            description="아직 등록된 멤버십 강의가 없습니다."
            actionLabel="첫 강의 업로드하기"
            onAction={canUpload() ? onUpload : undefined}
            icon="Users"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard
                  video={video}
                  currentUser={currentUser}
                  onEdit={onEdit}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MembershipPage