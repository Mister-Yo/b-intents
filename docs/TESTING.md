# Testing Guide - 1Click Swap

This guide is for QA testers to verify the functionality of the 1Click Swap application.

## Test Environment

**Production URL:** https://1ckick-intents-git-main-intents.vercel.app

## Prerequisites

- HOT Wallet browser extension installed
- Test tokens on supported chains (NEAR, Solana, Ethereum, Base, Arbitrum, TON)

## Test Cases

### 1. Wallet Connection

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1.1 | Connect wallet | Click "Connect" button in header | HOT Wallet modal opens |
| 1.2 | Successful connection | Approve connection in HOT Wallet | Wallet address displayed in header |
| 1.3 | Disconnect wallet | Click connected address → Disconnect | Returns to "Connect" button state |

### 2. Token Selection

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 2.1 | Select source chain | Click chain selector in "From" block | Chain selection dialog opens |
| 2.2 | Select destination chain | Click chain selector in "To" block | Chain selection dialog opens |
| 2.3 | Select source token | Click token in "From" block | Token selection dialog shows tokens for selected chain |
| 2.4 | Select destination token | Click token in "To" block | Token selection dialog shows tokens for selected chain |
| 2.5 | Search token | Type token name/symbol in search | Filtered token list displayed |

### 3. Quote Fetching

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 3.1 | Get swap quote | Enter amount in "From" field | "To" field shows calculated amount |
| 3.2 | USD value display | Enter amount with valid quote | "To receive: $X.XX" shown below output |
| 3.3 | Quote update on amount change | Change input amount | Quote updates automatically |
| 3.4 | Quote update on token change | Select different token | Quote recalculates |

### 4. Balance Display

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 4.1 | Balance shown | Connect wallet, select token | Balance displayed: "Balance: X.XXXX TOKEN" |
| 4.2 | MAX button | Click MAX button | Input fills with full balance |
| 4.3 | Insufficient balance | Enter amount > balance | Error: "Insufficient balance" |

### 5. Recipient Address

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 5.1 | Enter recipient | Enter valid address in recipient field | Address accepted |
| 5.2 | Invalid address | Enter invalid address | Validation error shown |
| 5.3 | Cross-chain recipient | Select different chain for output | Recipient field accepts that chain's address format |

### 6. Swap Execution

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 6.1 | Initiate swap | Fill form, click "Swap" | Transaction confirmation in HOT Wallet |
| 6.2 | Confirm transaction | Approve in HOT Wallet | Swap processing begins |
| 6.3 | Swap success | Wait for completion | Success message, history updated |
| 6.4 | Swap failure | Reject transaction | Error message displayed |

### 7. Swap History

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 7.1 | View history | Navigate to history tab/section | List of previous swaps shown |
| 7.2 | History details | Click on history item | Swap details displayed |

### 8. Cross-Chain Scenarios

Test swaps between different chain combinations:

| From | To | Status |
|------|-----|--------|
| NEAR | Ethereum | ⬜ |
| NEAR | Solana | ⬜ |
| NEAR | Base | ⬜ |
| NEAR | Arbitrum | ⬜ |
| NEAR | TON | ⬜ |
| Ethereum | NEAR | ⬜ |
| Solana | NEAR | ⬜ |
| Base | NEAR | ⬜ |
| Arbitrum | NEAR | ⬜ |
| TON | NEAR | ⬜ |

### 9. UI/UX Checks

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 9.1 | Mobile responsive | UI adapts to mobile screen sizes |
| 9.2 | Dark theme | All elements visible on dark background |
| 9.3 | Loading states | Skeleton/spinner shown during data fetch |
| 9.4 | Error messages | Clear, user-friendly error messages |
| 9.5 | Input validation | Only valid numeric input accepted |

## Known Limitations

1. **Token balance for output** - Balance not shown for "To" token (by design)
2. **Same-chain swaps** - May have different behavior than cross-chain
3. **Quote expiration** - Quotes may expire, requiring refresh

## Bug Reporting

When reporting bugs, please include:

1. **Steps to reproduce** - Exact actions taken
2. **Expected result** - What should happen
3. **Actual result** - What actually happened
4. **Screenshots** - If applicable
5. **Browser/Device** - Browser name, version, device type
6. **Wallet state** - Connected/disconnected, which chain
7. **Console errors** - Open DevTools (F12) → Console tab

## Supported Browsers

- Chrome (recommended)
- Firefox
- Edge
- Safari

## Contact

For questions or issues, contact the development team.
