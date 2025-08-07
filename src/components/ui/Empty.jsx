import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "콘텐츠가 없습니다",
  description = "아직 등록된 콘텐츠가 없습니다.",
  actionLabel = "새로 만들기",
  onAction,
  icon = "FileX"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-500 mb-8 max-w-md text-lg">{description}</p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-3" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty