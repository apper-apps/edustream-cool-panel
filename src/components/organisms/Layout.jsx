import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Layout = ({ children, currentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navigation = [
    { name: "홈", href: "/", icon: "Home" },
    { name: "멤버십", href: "/membership", icon: "Users" },
    { name: "마스터", href: "/master", icon: "Crown" },
    { name: "인사이트", href: "/insights", icon: "BookOpen" },
    { name: "도전 후기", href: "/reviews", icon: "MessageCircle" },
  ]

  const authLinks = [
    { name: "로그인", href: "/login", icon: "LogIn" },
    { name: "회원가입", href: "/signup", icon: "UserPlus" },
  ]

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/"
    return location.pathname.startsWith(href)
  }

  const handleNavigation = (href) => {
    navigate(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                EduStream Pro
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="px-4 py-2"
                  onClick={() => handleNavigation(item.href)}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>

            {/* Desktop Auth & Admin */}
            <div className="hidden lg:flex items-center space-x-2">
              {currentUser?.grade === "admin" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/admin")}
                >
                  <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
                  관리자
                </Button>
              )}
              
              {authLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation(link.href)}
                >
                  <ApperIcon name={link.icon} className="w-4 h-4 mr-2" />
                  {link.name}
                </Button>
              ))}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-2">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start px-3 py-2"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <ApperIcon name={item.icon} className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                ))}
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  {currentUser?.grade === "admin" && (
                    <Button
                      variant="secondary"
                      className="w-full justify-start px-3 py-2 mb-2"
                      onClick={() => handleNavigation("/admin")}
                    >
                      <ApperIcon name="Settings" className="w-4 h-4 mr-3" />
                      관리자 모드
                    </Button>
                  )}
                  
                  {authLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      className="w-full justify-start px-3 py-2 mb-1"
                      onClick={() => handleNavigation(link.href)}
                    >
                      <ApperIcon name={link.icon} className="w-4 h-4 mr-3" />
                      {link.name}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default Layout