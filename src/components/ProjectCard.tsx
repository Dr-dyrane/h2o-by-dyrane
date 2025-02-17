"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface Project {
  title: string
  description: string
  link: string
}

interface ProjectCardProps {
  project: Project
  index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true)
      try {
        const url = `https://api.microlink.io?url=https://${project.link}&screenshot=true&meta=false&embed=screenshot.url`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch image")
        }
        // Use the response URL directly as the image source
        setImageUrl(url)
      } catch (err) {
        console.error("Error fetching image:", err)
        setError("Failed to load preview")
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()
  }, [project.link])

  return (
    <a
      href={`https://${project.link}`}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-on-scroll glass group cursor-pointer rounded-xl p-6 transition-all duration-300 hover:bg-black hover:text-white border border-black/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 overflow-hidden rounded-lg h-40">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">{error}</div>
        ) : (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        )}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
      <p className="text-sm opacity-70">{project.description}</p>
    </a>
  )
}

export default ProjectCard

