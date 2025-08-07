import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import blogService from "@/services/api/blogService"

const EditBlogModal = ({ blog, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    accessLevels: ["free"]
  })
  
  const [loading, setLoading] = useState(false)
  const [isRichEditor, setIsRichEditor] = useState(false)

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        featuredImage: blog.featuredImage || "",
        accessLevels: blog.accessLevels || ["free"]
      })
    }
  }, [blog])

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

  const handleRichTextCommand = (command) => {
    document.execCommand(command, false, null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.")
      return
    }
    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요.")
      return
    }

    setLoading(true)
    try {
      const blogData = {
        ...formData,
        featuredImage: formData.featuredImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        excerpt: formData.excerpt || formData.content.substring(0, 200) + "..."
      }

      await blogService.update(blog.Id, blogData)
      toast.success("블로그 글이 수정되었습니다.")
      onClose()
    } catch (error) {
      toast.error("수정 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("이 글을 삭제하시겠습니까?")) {
      return
    }

    setLoading(true)
    try {
      await blogService.delete(blog.Id)
      toast.success("블로그 글이 삭제되었습니다.")
      onClose()
    } catch (error) {
      toast.error("삭제 중 오류가 발생했습니다.")
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
          <h2 className="text-2xl font-bold text-gray-900">인사이트 글 수정</h2>
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
              placeholder="블로그 글 제목을 입력하세요"
            />
            <Input
              label="대표 이미지 URL"
              value={formData.featuredImage}
              onChange={(e) => handleInputChange("featuredImage", e.target.value)}
              placeholder="이미지 URL (선택사항)"
            />
          </div>

          <Textarea
            label="요약"
            rows={2}
            value={formData.excerpt}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
            placeholder="블로그 글 요약 (선택사항 - 자동 생성됩니다)"
          />

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                내용 *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRichEditor(!isRichEditor)}
              >
                <ApperIcon name={isRichEditor ? "FileText" : "Code"} className="w-4 h-4 mr-2" />
                {isRichEditor ? "일반 모드" : "HTML 모드"}
              </Button>
            </div>

            {isRichEditor ? (
              <div>
                <div className="editor-toolbar">
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("bold")}
                  >
                    <ApperIcon name="Bold" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("italic")}
                  >
                    <ApperIcon name="Italic" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("underline")}
                  >
                    <ApperIcon name="Underline" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("insertUnorderedList")}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("insertOrderedList")}
                  >
                    <ApperIcon name="ListOrdered" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("formatBlock", "h2")}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className="editor-button"
                    onClick={() => handleRichTextCommand("formatBlock", "h3")}
                  >
                    H3
                  </button>
                </div>
                <div
                  className="editor-content"
                  contentEditable
                  onInput={(e) => handleInputChange("content", e.target.innerHTML)}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            ) : (
              <Textarea
                rows={12}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="블로그 글 내용을 입력하세요 (HTML 태그 사용 가능)"
              />
            )}
          </div>

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

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  수정 중...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  수정 완료
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              삭제
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

export default EditBlogModal