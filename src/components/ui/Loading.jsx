import { motion } from "framer-motion"

const Loading = ({ type = "grid" }) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === "player") {
    return (
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"
          />
          <div className="space-y-3">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6" />
          </div>
        </div>
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  )
}

export default Loading