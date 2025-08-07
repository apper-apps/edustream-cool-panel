import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import React from "react";

const VideoCard = ({ video, currentUser, onEdit, showControls = true }) => {
  const navigate = useNavigate()

  const canView = () => {
    if (!video.accessLevels || video.accessLevels.length === 0) return true
    
    if (currentUser.grade === "admin") return true
    if (currentUser.grade === "both" && 
        (video.accessLevels.includes("member") || video.accessLevels.includes("master"))) return true
    
    return video.accessLevels.includes(currentUser.grade)
  }

  const canEdit = () => {
    return currentUser.grade === "admin"
  }

  const handleCardClick = () => {
    if (canView()) {
      navigate(`/video/${video.Id}`)
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
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ApperIcon name="Play" className="w-8 h-8 text-primary ml-1" />
          </motion.div>
        </div>
        
        {video.isPinned && (
          <div className="absolute top-2 right-2">
            <Badge variant="pinned">
              <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
              고정
            </Badge>
          </div>
        )}

        {!canView() && currentUser.grade === "admin" && (
          <div className="absolute top-2 left-2">
            <Badge variant="default">접근 제한</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {video.title}
          </h3>
          {canEdit() && showControls && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-2"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(video)
              }}
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {video.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {video.accessLevels?.map((level) => (
              <Badge key={level} variant={level}>
                {level === "free" ? "무료" : 
                 level === "member" ? "멤버" :
                 level === "master" ? "마스터" :
                 level === "both" ? "멤버+마스터" : "관리자"}
              </Badge>
            ))}
          </div>
          
          {video.curriculum && (
            <span className="text-xs text-gray-500">
              {video.curriculum.length}개 강의
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default VideoCard