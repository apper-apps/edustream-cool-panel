import { cn } from "@/utils/cn"

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    free: "bg-green-100 text-green-800",
    member: "bg-blue-100 text-blue-800",
    master: "bg-purple-100 text-purple-800",
    both: "bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800",
    admin: "bg-red-100 text-red-800",
    pinned: "bg-gradient-to-r from-accent to-red-500 text-white"
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export default Badge