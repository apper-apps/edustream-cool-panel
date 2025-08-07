import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import React from "react";

const BlogCard = ({ blog, currentUser, onEdit, showControls = true }) => {
  const navigate = useNavigate()

  const canView = () => {
    if (!blog.accessLevels || blog.accessLevels.length === 0) return true
    
    if (currentUser.grade === "admin") return true
    if (currentUser.grade === "both" && 
        (blog.accessLevels.includes("member") || blog.accessLevels.includes("master"))) return true
    
    return blog.accessLevels.includes(currentUser.grade)
  }

  const canEdit = () => {
    return currentUser.grade === "admin"
  }

  const handleCardClick = () => {
    if (canView()) {
      navigate(`/blog/${blog.Id}`)
    }
  }

  if (!canView() && currentUser.grade !== "admin") {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl",
        !canView() && currentUser.grade === "admin" && "opacity-50 border-2 border-dashed border-gray-300"
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-video">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {!canView() && currentUser.grade === "admin" && (
          <div className="absolute top-2 left-2">
            <Badge variant="default">접근 제한</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {blog.title}
          </h3>
          {canEdit() && showControls && (
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(blog)
                }}
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-error hover:bg-error/10"
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm("이 글을 삭제하시겠습니까?")) {
                    // Handle delete
                  }
                }}
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {blog.accessLevels?.map((level) => (
              <Badge key={level} variant={level}>
                {level === "free" ? "무료" : 
                 level === "member" ? "멤버" :
                 level === "master" ? "마스터" :
                 level === "both" ? "멤버+마스터" : "관리자"}
              </Badge>
            ))}
          </div>
          
          <span className="text-xs text-gray-500">
            {format(new Date(blog.createdAt), "M월 d일", { locale: ko })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogCard