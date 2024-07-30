import React from 'react'
import toast from 'react-hot-toast'
import Logger from '@/libs/logger.util'
import AuthService from '@/features/auth/auth.service'
import { Loader } from '@/components/molecules/loader'
import { useLocalStorage } from '@/features/shared/hooks/useLocalStorage'
import {
  ICreateUserPayload,
  IUserLogin,
  IUserLoginBaha
} from '@/features/auth/auth.interface'
import { USER_TYPE } from '@/features/user/user.interface'
import {
  AUTH_MESSAGE,
  LOCAL_STORAGE_KEYS,
  ROUTES
} from '@/features/shared/shared.interface'
import { useRouter } from 'next/navigation'

interface IAuthContext {
  user: IUserLogin | null
  loading: Boolean
  logOut: () => void
  loginWithEmail: (
    data: Record<string, string | number | boolean>
  ) => Promise<boolean>
  registerUser: (
    createRegistrationPayload: ICreateUserPayload
  ) => Promise<boolean>
}

const AuthContext = React.createContext<IAuthContext>({
  user: null,
  loading: true,
  logOut: () => {},
  loginWithEmail: async (data: Record<string, string | number | boolean>) =>
    false,
  registerUser: async (createRegistrationPayload: ICreateUserPayload) => false
})

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const router = useRouter()
  const [user, setUser] = React.useState<IUserLogin | null>(null)
  const [loading, setLoading] = React.useState<Boolean>(false)

  const {
    removeItem: removeToken,
    getItem: getToken,
    setItem: setToken
  } = useLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)

  const {
    removeItem: removeUserName,
    getItem: getUserName,
    setItem: setUserName
  } = useLocalStorage(LOCAL_STORAGE_KEYS.USERNAME)

  const {
    removeItem: removeUserType,
    getItem: getUserType,
    setItem: setUserType
  } = useLocalStorage(LOCAL_STORAGE_KEYS.USERTYPE)

  const logOut = () => {
    removeToken()
    removeUserName()
    removeUserType()
    setUser(null)
    toast.success(AUTH_MESSAGE.USER_LOGGED_OUT)
  }

  const checkIsUserLoggedIn = () => {
    const token = getToken()
    const username = getUserName()
    const user_type = getUserType()
    setLoading(false)
    if (token && username && user_type) {
      return setUser({
        token,
        username,
        user_type
      })
    }
    return setUser(null)
  }

  const handleUserOnAuth = (user: IUserLogin) => {
    if (user?.token && user?.username && user?.user_type) {
      setToken(user.token)
      setUserName(user.username)
      setUserType(user.user_type)
      setUser(user)
      setLoading(false)
      router.push(ROUTES.HOME)
      toast.success(AUTH_MESSAGE.USER_LOGGED_IN)
      return true
    }
    return false
  }

  const loginWithEmail = async (
    data: Record<string, string | number | boolean>
  ) => {
    try {
      const userLoginPayload = {
        email: data.email,
        password: data.password,
        user_type: USER_TYPE.CUSTOMER
      } as IUserLoginBaha
      const response: any = await AuthService.userLogin(userLoginPayload)
      return handleUserOnAuth(response)
    } catch (error) {
      Logger.error('Login with email error')
      return false
    }
  }

  const registerUser = async (
    createRegistrationPayload: ICreateUserPayload
  ) => {
    const { user: response }: any = await AuthService.createUser(
      createRegistrationPayload
    )
    return handleUserOnAuth(response)
  }

  React.useEffect(() => {
    return () => checkIsUserLoggedIn()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, logOut, loginWithEmail, registerUser }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  )
}

export const useFirebaseAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider')
  }
  return context
}
