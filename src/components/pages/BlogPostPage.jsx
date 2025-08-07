import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import BlogCard from "@/components/molecules/BlogCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import blogService from "@/services/api/blogService"

const BlogPostPage = ({ currentUser, onEdit }) => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadBlog()
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [blogData, allBlogs] = await Promise.all([
        blogService.getById(parseInt(id)),
        blogService.getAll()
      ])
      
      setBlog(blogData)
      
      // Get related blogs (excluding current blog)
      const related = allBlogs
        .filter(b => b.Id !== blogData.Id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
      
      setRelatedBlogs(related)
    } catch (err) {
      setError("블로그 글을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const canView = () => {
    if (!blog || !blog.accessLevels || blog.accessLevels.length === 0) return true
    
    if (currentUser.grade === "admin") return true
    if (currentUser.grade === "both" && 
        (blog.accessLevels.includes("member") || blog.accessLevels.includes("master"))) return true
    
    return blog.accessLevels.includes(currentUser.grade)
  }

  const canEdit = () => {
    return currentUser.grade === "admin"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <Error message={error} onRetry={loadBlog} />
  }

  if (!blog) {
    return <Error message="블로그 글을 찾을 수 없습니다." />
  }

  if (!canView()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Lock" className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-gray-600 mb-6">이 글을 읽으려면 적절한 멤버십이 필요합니다.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {blog.accessLevels?.map((level) => (
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

  return (
    <div className="min-h-screen bg-background">
      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-64 md:h-80">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.accessLevels?.map((level) => (
                  <Badge key={level} variant={level}>
                    {level === "free" ? "무료" : 
                     level === "member" ? "멤버" :
                     level === "master" ? "마스터" :
                     level === "both" ? "멤버+마스터" : "관리자"}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {blog.title}
              </h1>
              
              <p className="text-gray-200 text-lg">
                {format(new Date(blog.createdAt), "yyyy년 M월 d일", { locale: ko })}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                <ApperIcon name="Calendar" className="w-4 h-4 inline mr-2" />
                {format(new Date(blog.createdAt), "yyyy년 M월 d일", { locale: ko })}
              </div>
              
              {canEdit() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(blog)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                  수정
                </Button>
              )}
            </div>

            <div 
              className="prose prose-lg prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.article>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              다른 인사이트 글
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard
                    blog={relatedBlog}
                    currentUser={currentUser}
                    onEdit={onEdit}
                    showControls={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogPostPage