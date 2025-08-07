import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import MembershipPage from "@/components/pages/MembershipPage"
import MasterPage from "@/components/pages/MasterPage"
import VideoPlayerPage from "@/components/pages/VideoPlayerPage"
import InsightPage from "@/components/pages/InsightPage"
import BlogPostPage from "@/components/pages/BlogPostPage"
import ReviewPage from "@/components/pages/ReviewPage"
import AdminPage from "@/components/pages/AdminPage"
import UploadVideoModal from "@/components/organisms/UploadVideoModal"
import EditVideoModal from "@/components/organisms/EditVideoModal"
import UploadBlogModal from "@/components/organisms/UploadBlogModal"
import EditBlogModal from "@/components/organisms/EditBlogModal"
import { useState } from "react"

function App() {
  const [currentUser] = useState({
    Id: 1,
    name: "테스트 사용자",
    email: "test@example.com",
    grade: "admin"
  })

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBlogUploadModal, setShowBlogUploadModal] = useState(false)
  const [showBlogEditModal, setShowBlogEditModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [uploadSection, setUploadSection] = useState("membership")

  const openUploadModal = (section) => {
    setUploadSection(section)
    setShowUploadModal(true)
  }

  const openEditModal = (video) => {
    setEditingVideo(video)
    setShowEditModal(true)
  }

  const openBlogUploadModal = () => {
    setShowBlogUploadModal(true)
  }

  const openBlogEditModal = (blog) => {
    setEditingBlog(blog)
    setShowBlogEditModal(true)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout currentUser={currentUser}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/membership" element={
              <MembershipPage 
                currentUser={currentUser} 
                onUpload={() => openUploadModal("membership")}
                onEdit={openEditModal}
              />
            } />
            <Route path="/master" element={
              <MasterPage 
                currentUser={currentUser}
                onUpload={() => openUploadModal("master")}
                onEdit={openEditModal}
              />
            } />
            <Route path="/video/:id" element={
              <VideoPlayerPage 
                currentUser={currentUser}
                onEdit={openEditModal}
              />
            } />
            <Route path="/insights" element={
              <InsightPage 
                currentUser={currentUser}
                onUpload={openBlogUploadModal}
                onEdit={openBlogEditModal}
              />
            } />
            <Route path="/blog/:id" element={
              <BlogPostPage 
                currentUser={currentUser}
                onEdit={openBlogEditModal}
              />
            } />
            <Route path="/reviews" element={<ReviewPage currentUser={currentUser} />} />
            <Route path="/admin" element={<AdminPage currentUser={currentUser} />} />
          </Routes>
        </Layout>

        {showUploadModal && (
          <UploadVideoModal
            section={uploadSection}
            onClose={() => setShowUploadModal(false)}
          />
        )}

        {showEditModal && editingVideo && (
          <EditVideoModal
            video={editingVideo}
            onClose={() => {
              setShowEditModal(false)
              setEditingVideo(null)
            }}
          />
        )}

        {showBlogUploadModal && (
          <UploadBlogModal
            onClose={() => setShowBlogUploadModal(false)}
          />
        )}

        {showBlogEditModal && editingBlog && (
          <EditBlogModal
            blog={editingBlog}
            onClose={() => {
              setShowBlogEditModal(false)
              setEditingBlog(null)
            }}
          />
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App