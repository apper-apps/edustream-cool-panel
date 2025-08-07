import videoData from "@/services/mockData/videos.json"

class VideoService {
  constructor() {
    this.data = [...videoData]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.data.map(item => ({ ...item }))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const item = this.data.find(video => video.Id === id)
    if (!item) {
      throw new Error("Video not found")
    }
    return { ...item }
  }

  async create(videoData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find highest Id and add 1
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newVideo = {
      ...videoData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    
    this.data.push(newVideo)
    return { ...newVideo }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.data.findIndex(video => video.Id === id)
    if (index === -1) {
      throw new Error("Video not found")
    }
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.data.findIndex(video => video.Id === id)
    if (index === -1) {
      throw new Error("Video not found")
    }
    
    this.data.splice(index, 1)
    return true
  }
}

export default new VideoService()