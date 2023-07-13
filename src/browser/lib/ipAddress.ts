export const getHostIpAddress = async () => {
  const { networkInterfaces } = await import('os')
  const nets = networkInterfaces()

  console.log('nets', nets)

  const addresses = Object.values(nets).reduce((acc, net) => {
    if (net.length) {
      const ipV4Addresses = net.filter((net) => net.family === 'IPv4' && !net.internal)
      if (ipV4Addresses.length) {
        acc.push(ipV4Addresses[0].address)
      }
    }

    return acc
  }, [] as string[])

  return addresses
}
