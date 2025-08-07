import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import React, { useState } from "react";

const ReviewPost = ({ review, currentUser, onEdit, onDelete, onToggleVisibility }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(review.content)

  const canModerate = () => {
    return currentUser.grade === "admin"
  }

  const canEdit = () => {
    return review.authorId === currentUser.Id || currentUser.grade === "admin"
  }

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(review.Id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(review.content)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg",
        review.isHidden && "opacity-50 border-2 border-dashed border-gray-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {review.authorName?.charAt(0) || "U"}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {review.authorName || "사용자"}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "M월 d일 H:mm", { locale: ko })}
              </span>
              {review.isHidden && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  숨김
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {canEdit() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
              )}
              
              {canModerate() && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    onClick={() => onToggleVisibility(review.Id)}
                  >
                    <ApperIcon 
                      name={review.isHidden ? "Eye" : "EyeOff"} 
                      className="w-4 h-4" 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-error hover:bg-error/10"
                    onClick={() => {
                      if (window.confirm("이 후기를 삭제하시겠습니까?")) {
                        onDelete(review.Id)
                      }
                    }}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                placeholder="후기를 작성해주세요..."
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {editContent.length}/500
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    저장
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    취소
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {review.content}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ReviewPost