const Info = ({ account, accountBalance, expiryTimestamp }) => {
    return (
        <div className="my-3">
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Tokens owned:</strong> {accountBalance}</p>
            <p><strong>Closing date:</strong> {expiryTimestamp.toLocaleString()}</p>
        </div>
    )
}

export default Info;