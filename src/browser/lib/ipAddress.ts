export const getHostIpAddress = async () => {
  const { networkInterfaces } = await import('os')
  const nets = networkInterfaces()

  const addresses = Object.values(nets)
    .reduce((acc, net) => {
      if (net.length) {
        const ipV4Addresses = net.filter((net) => net.family === 'IPv4' && !net.internal)
        if (ipV4Addresses.length) {
          acc.push(ipV4Addresses[0].address)
        }
      }

      return acc
    }, [] as string[])
    .sort((a, b) => {
      return a.startsWith('192.168.0') ? -1 : a > b ? -1 : 1
    })

  return addresses
}
