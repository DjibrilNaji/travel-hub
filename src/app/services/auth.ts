import routes from "@/routes"
import axiosClient from "@/utils/axiosInstance"

export const login = async (userId: string) => {
  const data = await axiosClient.post(routes.api.auth.login, {
    userId
  })

  return data.data
}

export const logout = async (userId: string, token: string) => {
  const data = await axiosClient.delete(routes.api.auth.logout, {
    data: { userId, token }
  })

  return data.data
}
