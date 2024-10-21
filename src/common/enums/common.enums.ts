
/**
 *  Exception messages for invalid transactions
 */
enum TransactionExceptionMessage {
    /**
     * @member - send to self exception
     */
    SEND_TO_SELF_EXCEPTION = 'cannot send to self',

    /**
     * @member - no recipient exists
     */
    NO_RECIPIENT = 'recipient does not exist',

    /**
     * @member - duplicate transaction reference
     */
    DUPLICATE_TX_REFERENCE = 'duplicate transaction reference',

    /**
     * @member - invalid transaction reference
     */
    INVALID_TX_REFERENCE = 'invalid transaction reference',

    /**
     * @member - insufficient funds
     */
    INSUFFICIENT_FUND = 'insufficient funds'
}