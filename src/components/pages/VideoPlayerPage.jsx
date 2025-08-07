import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import videoService from "@/services/api/videoService"

const VideoPlayerPage = ({ currentUser, onEdit }) => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadVideo()
  }, [id])

  const loadVideo = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await videoService.getById(parseInt(id))
      setVideo(data)
    } catch (err) {
      setError("동영상을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const canView = () => {
    if (!video || !video.accessLevels || video.accessLevels.length === 0) return true
    
    if (currentUser.grade === "admin") return true
    if (currentUser.grade === "both" && 
        (video.accessLevels.includes("member") || video.accessLevels.includes("master"))) return true
    
    return video.accessLevels.includes(currentUser.grade)
  }

  const canEdit = () => {
    return currentUser.grade === "admin"
  }

  const getVideoEmbedUrl = (url) => {
    if (!url) return ""
    
    // YouTube URL conversion
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    return url
  }

  const getCurrentVideo = () => {
    if (!video?.curriculum || video.curriculum.length === 0) {
      return { title: video?.title, url: video?.videoUrl }
    }
    return video.curriculum[currentVideoIndex] || video.curriculum[0]
  }

  if (loading) {
    return <Loading type="player" />
  }

  if (error) {
    return <Error message={error} onRetry={loadVideo} />
  }

  if (!video) {
    return <Error message="동영상을 찾을 수 없습니다." />
  }

  if (!canView()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Lock" className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600 mb-6">이 강의를 시청하려면 적절한 멤버십이 필요합니다.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {video.accessLevels?.map((level) => (
              <Badge key={level} variant={level}>
                {level === "free" ? "무료" : 
                 level === "member" ? "멤버" :
                 level === "master" ? "마스터" :
                 level === "both" ? "멤버+마스터" : "관리자"}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentVideo = getCurrentVideo()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video Player */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Video Player */}
              <div className="video-container">
                {currentVideo.url ? (
                  <iframe
                    src={getVideoEmbedUrl(currentVideo.url)}
                    title={currentVideo.title}
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <ApperIcon name="Play" className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentVideo.title || video.title}
                    </h1>
                    {video.isPinned && (
                      <Badge variant="pinned" className="mb-3">
                        <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
                        고정된 강의
                      </Badge>
                    )}
                  </div>
                  
                  {canEdit() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(video)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                      수정
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {video.accessLevels?.map((level) => (
                    <Badge key={level} variant={level}>
                      {level === "free" ? "무료" : 
                       level === "member" ? "멤버" :
                       level === "master" ? "마스터" :
                       level === "both" ? "멤버+마스터" : "관리자"}
                    </Badge>
                  ))}
                </div>

                {video.description && (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Curriculum Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 order-last lg:order-none"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                강의 목록
              </h3>
              
              {video.curriculum && video.curriculum.length > 0 ? (
                <div className="space-y-2">
                  {video.curriculum.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        currentVideoIndex === index
                          ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          currentVideoIndex === index 
                            ? "bg-white/20" 
                            : "bg-gray-200"
                        }`}>
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                        {currentVideoIndex === index && (
                          <ApperIcon name="Play" className="w-4 h-4" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="FileX" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>등록된 커리큘럼이 없습니다</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerPage