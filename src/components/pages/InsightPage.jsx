import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import BlogCard from "@/components/molecules/BlogCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import blogService from "@/services/api/blogService"

const InsightPage = ({ currentUser, onUpload, onEdit }) => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      setError("")
      
      const data = await blogService.getAll()
      const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      setBlogs(sortedBlogs)
    } catch (err) {
      setError("인사이트를 불러오는데 실패했습니다.")
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
    return <Error message={error} onRetry={loadBlogs} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  인사이트
                </h1>
                <p className="text-gray-600 mt-1">
                  전문가의 깊이 있는 인사이트와 지식
                </p>
              </div>
            </div>

            {canUpload() && (
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                onClick={onUpload} 
                size="lg"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                글 작성하기
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blogs.length === 0 ? (
          <Empty
            title="인사이트 글이 없습니다"
            description="아직 작성된 인사이트가 없습니다."
            actionLabel="첫 글 작성하기"
            onAction={canUpload() ? onUpload : undefined}
            icon="BookOpen"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard
                  blog={blog}
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

export default InsightPage