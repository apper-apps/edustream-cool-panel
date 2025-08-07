import userData from "@/services/mockData/users.json"

class UserService {
  constructor() {
    this.data = [...userData]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.data.map(item => ({ ...item }))
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const item = this.data.find(user => user.Id === id)
    if (!item) {
      throw new Error("User not found")
    }
    return { ...item }
  }

  async create(userData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Find highest Id and add 1
    const maxId = this.data.reduce((max, item) => Math.max(max, item.Id), 0)
    const newUser = {
      ...userData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    
    this.data.push(newUser)
    return { ...newUser }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.data.findIndex(user => user.Id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    
    this.data[index] = { ...this.data[index], ...updateData }
    return { ...this.data[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.data.findIndex(user => user.Id === id)
    if (index === -1) {
      throw new Error("User not found")
    }
    
    this.data.splice(index, 1)
    return true
  }
}

export default new UserService()