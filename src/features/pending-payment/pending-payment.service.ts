import HttpService from '@/services/HttpService'
import { IPaymentRedirect } from './pending-payment.interface'

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const getTrekRequestDetail = async (trekRequestId: string) => {
  try {
    const { data } = await HttpService.get(
      `${baseApiUrl}/trek-request/${trekRequestId}`
    )
    return data as IPaymentRedirect
  } catch (error) {
    console.error('Error during login request:', error)
    return null
  }
}

export const pendingPaymentService = {
  getTrekRequestDetail
}