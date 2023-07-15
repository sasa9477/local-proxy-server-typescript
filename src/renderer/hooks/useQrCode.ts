import { useCallback, useState } from 'react'
import QRCode from 'qrcode'

export const useQrCode = () => {
  const [qrCode, setQrCode] = useState('')

  const convertQrCode = useCallback(async (serverUrl: string) => {
    const qrCodeImage = await QRCode.toDataURL(serverUrl, {
      scale: 3,
    })
    setQrCode(qrCodeImage)
  }, [])

  return { qrCode, convertQrCode }
}
