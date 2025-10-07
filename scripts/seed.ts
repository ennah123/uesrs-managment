import { loadEnvConfig } from '@next/env'
const projectDir = process.cwd()
loadEnvConfig(projectDir)

import dbConnect from '@/lib/mongoose'
import mongoose from 'mongoose'
import User from '@/models/User'
import { createUser } from '@/lib/factories/userFactory'

async function main() {
    await dbConnect()
    
    try {
        for (let i = 0; i < 10; i++) {
            const userData = await createUser()
            await User.create(userData)
            console.log(`Created user ${i + 1}/10`)
        }
        console.log('Successfully seeded 10 users')
    } catch (error) {
        console.error('Error seeding users:', error)
        throw error
    } finally {
        await mongoose.connection.close()
        console.log('MongoDB connection closed')
    }
}

main()
  .then(() => {
    console.log('Seed script completed')
    process.exit(0)
  })
  .catch(err => {
    console.error('Seed script failed:', err)
    process.exit(1)
  })