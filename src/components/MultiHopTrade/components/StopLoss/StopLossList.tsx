import { Box, VStack } from '@chakra-ui/react'


import { Amount } from '@/components/Amount/Amount'
import { Card, CardBody } from '@chakra-ui/react'
import { Text } from '@/components/Text'
import { selectAllOrders } from '@/state/slices/stopLossSlice/selectors'
import { useAppSelector } from '@/state/store'
import { selectAssetById } from '@/state/slices/assetsSlice/selectors'
import { StopLossOrder } from '@/state/slices/stopLossSlice/types'

import { bnOrZero } from '@/lib/bignumber/bignumber'

// Helper component to display order details with asset info
const StopLossOrderRow = ({ order }: { order: StopLossOrder }) => {
    const sellAsset = useAppSelector(state => selectAssetById(state, order.params.sellAssetId ?? ''))

    const sellAmountCryptoPrecision = bnOrZero(order.params.sellAmountCryptoBaseUnit)
        .div(bnOrZero(10).pow(sellAsset?.precision ?? 18))
        .toString()

    return (
        <Box>
            <Text translation={['navBar.stopLoss.orderSummary', { status: order.status }]} />
            <Amount.Crypto
                value={sellAmountCryptoPrecision}
                symbol={sellAsset?.symbol ?? ''}
            />
            <Text translation={['navBar.stopLoss.triggerDetails', {
                type: order.params.triggerType,
                value: order.params.triggerValue
            }]} />
        </Box>
    )
}

export const StopLossList = () => {
    // const translate = useTranslate()
    const orders = useAppSelector(selectAllOrders)

    if (orders.length === 0) {
        return (
            <Card flex={1} borderRadius='xl'>
                <CardBody p={6}>
                    <Text translation='navBar.stopLoss.noOrders' textAlign='center' color='gray.500' />
                </CardBody>
            </Card>
        )
    }

    return (
        <Card flex={1} borderRadius='xl'>
            <CardBody p={4}>
                <VStack spacing={4} align='stretch'>
                    <Text translation='navBar.stopLoss.activeOrders' fontWeight='bold' />
                    {orders.map(order => (
                        <Box
                            key={order.id}
                            p={4}
                            borderWidth={1}
                            borderRadius='md'
                            borderColor='gray.700'
                        >
                            <StopLossOrderRow order={order} />
                        </Box>
                    ))}
                </VStack>
            </CardBody>
        </Card>
    )
}
