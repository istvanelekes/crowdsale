import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { useState } from 'react';
import { ethers } from 'ethers';

const Buy = ({ provider, price, crowdsale, setIsLoading }) => {

    const [amount, setAmount] = useState('0')
    const [userToWhitelist, setUserToWhitelist] = useState('0x')
    const [isWaiting, setIsWaiting] = useState(false)

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)

        try {
            const signer = provider.getSigner()
            
            const value = ethers.utils.parseUnits((amount*price).toString(), 'ether')
            const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

            const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
            await transaction.wait()
        } catch {
            window.alert('User rejected or transaction reverted')
        }

        setIsLoading(true)
    }

    const whitelistHandler = async () => {
        setIsWaiting(true)

        try {
            const signer = provider.getSigner()

            const transaction = await crowdsale.connect(signer).addToWhitelist(userToWhitelist)
            await transaction.wait()
        } catch {
            window.alert('User whitelisting rejected or transaction reverted')
        }
        
        setIsLoading(true)
    }

    return (
        <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
            <Form.Group as={Row}>
                <Col className="d-grid gap-3">
                    <Form.Control type="number" placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)}/>
                    <Form.Control type="text" placeholder="Enter user address" onChange={(e) => setUserToWhitelist(e.target.value)}/>
                </Col>
                <Col className='d-grid gap-3 text-center'>
                    {isWaiting ? (
                        <Spinner animation="border"/>
                    ) : (
                        <>
                        <Button variant="primary" type="submit" style={{ width: '100%'}}>
                            Buy Tokens
                        </Button>

                        <Button variant="primary" onClick={whitelistHandler} style={{ width: '100%'}}>
                            Whitelist me
                        </Button>
                        </>
                    )}
                    
                </Col>
            </Form.Group>
        </Form>
    )
}

export default Buy