import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import VideoCard from "@/components/molecules/VideoCard"
import BlogCard from "@/components/molecules/BlogCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import videoService from "@/services/api/videoService"
import blogService from "@/services/api/blogService"

const HomePage = () => {
  const navigate = useNavigate()
  const [featuredVideos, setFeaturedVideos] = useState([])
  const [featuredBlogs, setFeaturedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const currentUser = {
    Id: 1,
    name: "테스트 사용자",
    email: "test@example.com",
    grade: "admin"
  }

  useEffect(() => {
    loadFeaturedContent()
  }, [])

  const loadFeaturedContent = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [videosData, blogsData] = await Promise.all([
        videoService.getAll(),
        blogService.getAll()
      ])
      
      // Get featured videos (pinned ones first, then latest)
      const sortedVideos = videosData.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      
      setFeaturedVideos(sortedVideos.slice(0, 8))
      setFeaturedBlogs(blogsData.slice(0, 6))
    } catch (err) {
      setError("콘텐츠를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading type="grid" />
  }

  if (error) {
    return <Error message={error} onRetry={loadFeaturedContent} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <ApperIcon name="GraduationCap" className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                EduStream Pro
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              체계적인 학습 시스템과 단계별 커리큘럼으로 <br />
              전문가가 되는 여정을 함께하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/membership")}
                className="px-8 py-4 text-lg"
              >
                <ApperIcon name="Users" className="w-5 h-5 mr-3" />
                멤버십 콘텐츠 보기
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/master")}
                className="px-8 py-4 text-lg"
              >
                <ApperIcon name="Crown" className="w-5 h-5 mr-3" />
                마스터 과정 보기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              추천 강의
            </h2>
            <p className="text-gray-600 text-lg">
              인기 있는 강의와 최신 콘텐츠를 만나보세요
            </p>
          </motion.div>

          {featuredVideos.length === 0 ? (
            <Empty
              title="추천 강의가 없습니다"
              description="아직 등록된 강의가 없습니다."
              icon="Video"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVideos.map((video, index) => (
                <motion.div
                  key={video.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VideoCard
                    video={video}
                    currentUser={currentUser}
                    showControls={false}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/membership")}
            >
              모든 강의 보기
              <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Insights Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              최신 인사이트
            </h2>
            <p className="text-gray-600 text-lg">
              전문가의 깊이 있는 인사이트와 트렌드를 확인하세요
            </p>
          </motion.div>

          {featuredBlogs.length === 0 ? (
            <Empty
              title="인사이트 글이 없습니다"
              description="아직 작성된 인사이트가 없습니다."
              icon="BookOpen"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard
                    blog={blog}
                    currentUser={currentUser}
                    showControls={false}
                  />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/insights")}
            >
              모든 인사이트 보기
              <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 시작하세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              체계적인 학습으로 전문가의 길을 걸어보세요
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-primary border-white hover:bg-gray-100"
              onClick={() => navigate("/signup")}
            >
              <ApperIcon name="UserPlus" className="w-5 h-5 mr-3" />
              무료로 시작하기
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage