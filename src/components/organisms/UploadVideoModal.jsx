import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import videoService from "@/services/api/videoService"

const UploadVideoModal = ({ section, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    accessLevels: ["free"],
    isPinned: false
  })
  
  const [curriculum, setCurriculum] = useState([{ title: "", url: "" }])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAccessLevelChange = (level) => {
    setFormData(prev => ({
      ...prev,
      accessLevels: prev.accessLevels.includes(level)
        ? prev.accessLevels.filter(l => l !== level)
        : [...prev.accessLevels, level]
    }))
  }

  const addCurriculumItem = () => {
    setCurriculum(prev => [...prev, { title: "", url: "" }])
  }

  const removeCurriculumItem = (index) => {
    setCurriculum(prev => prev.filter((_, i) => i !== index))
  }

  const updateCurriculumItem = (index, field, value) => {
    setCurriculum(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.")
      return
    }

    setLoading(true)
    try {
      const videoData = {
        ...formData,
        thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        curriculum: curriculum.filter(item => item.title.trim() && item.url.trim()),
        section: section,
        createdAt: new Date().toISOString()
      }

      await videoService.create(videoData)
      toast.success("동영상이 업로드되었습니다.")
      onClose()
    } catch (error) {
      toast.error("업로드 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {section === "membership" ? "멤버십" : "마스터"} 동영상 업로드
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="제목 *"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="동영상 제목을 입력하세요"
            />
            <Input
              label="썸네일 이미지 URL"
              value={formData.thumbnailUrl}
              onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
              placeholder="이미지 URL (선택사항)"
            />
          </div>

          <Textarea
            label="설명"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="동영상에 대한 설명을 입력하세요"
          />

          <Input
            label="동영상 URL/Embed Code"
            value={formData.videoUrl}
            onChange={(e) => handleInputChange("videoUrl", e.target.value)}
            placeholder="YouTube URL 또는 embed 코드를 입력하세요"
          />

          {/* Access Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              접근 권한 설정 *
            </label>
            <div className="flex flex-wrap gap-3">
              {["free", "member", "master", "both"].map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accessLevels.includes(level)}
                    onChange={() => handleAccessLevelChange(level)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">
                    {level === "free" ? "무료" : 
                     level === "member" ? "멤버" :
                     level === "master" ? "마스터" : "멤버+마스터"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pin Option */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => handleInputChange("isPinned", e.target.checked)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <span className="text-sm font-medium text-gray-700">
                상단에 고정하기
              </span>
            </label>
          </div>

          {/* Curriculum */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                커리큘럼 (강의 목록)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCurriculumItem}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                추가
              </Button>
            </div>
            
            <div className="space-y-3">
              {curriculum.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <Input
                    label={`강의 ${index + 1} 제목`}
                    value={item.title}
                    onChange={(e) => updateCurriculumItem(index, "title", e.target.value)}
                    placeholder="강의 제목"
                  />
                  <Input
                    label="동영상 URL"
                    value={item.url}
                    onChange={(e) => updateCurriculumItem(index, "url", e.target.value)}
                    placeholder="YouTube URL"
                  />
                  {curriculum.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="p-3 text-error hover:bg-error/10"
                      onClick={() => removeCurriculumItem(index)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                  업로드
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default UploadVideoModal