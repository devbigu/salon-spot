# Customer Ledger Flow Test Report

Generated: 2026-06-17

Environment: `.env.test` / PostgreSQL `salon_test_db`

## Summary

- Passed: 7 Jest tests across 5 suites after fix
- Failed: 0 after fix
- Skipped: 0
- New reusable test file: `src/__tests__/customer-ledger.test.ts`
- Ledger checks are not skipped: missing/wrong `outstandingAmount` or missing/wrong `CustomerTransaction` rows throw explicit test failures.

## Preflight Checks

All required checks passed:

```text
npx prisma format
npx prisma generate
npx tsc --noEmit
npm run build
```

Final verification also passed:

```text
npx prisma validate
npm test
npx tsc --noEmit
npm run build
```

## Tested Flow

The automated test creates fresh data for:

- SUPER_ADMIN
- Salon A
- Branch A
- SALON_ADMIN assigned to Salon A
- Staff A
- Customer A
- Main service
- Service with price `599`, duration `45 MINUTES`
- Appointment
- Completed appointment status flow
- Invoice from appointment
- Partial payment
- Final payment
- Overpayment attempt
- Salon B isolation data

## Important Request Bodies

### Service Creation

```json
{
  "name": "Ledger Haircut <timestamp>",
  "price": 599,
  "durationValue": 45,
  "durationUnit": "MINUTES",
  "branchId": "BRANCH_A_ID",
  "mainServiceId": "MAIN_SERVICE_A_ID"
}
```

### Appointment Creation

```json
{
  "branchId": "BRANCH_A_ID",
  "customerId": "CUSTOMER_A_ID",
  "staffId": "STAFF_A_ID",
  "serviceIds": ["SERVICE_A_ID"],
  "startTime": "2030-02-01T10:00:00.000Z"
}
```

Expected and verified:

- `estimatedAmount = 599`
- `totalDurationMinutes = 45`

### Invoice Creation

Route:

```text
POST /api/invoices/from-appointment/:appointmentId
```

Body:

```json
{
  "invoiceType": "BILL_OF_SUPPLY",
  "discountAmount": 0,
  "processingFeeAmount": 0
}
```

Expected and verified:

- Invoice created
- `totalAmount = 599`
- `paymentStatus = UNPAID`
- `balanceAmount = 599`
- Customer `outstandingAmount = 599`
- Test fails if customer `outstandingAmount` is not exactly `599`
- Ledger entry:
  - `type = INVOICE`
  - `debit = 599`
  - `credit = 0`
  - `billNo = invoice.invoiceCode`
  - `invoiceId = invoice.id`
  - `paymentId = null`
  - `status = COMPLETE`
  - `balanceAfter = 599`
- Test fails if this `CustomerTransaction` row is missing or any field above is wrong

### Partial Payment

Route:

```text
POST /api/payments
```

Body:

```json
{
  "invoiceId": "INVOICE_ID",
  "amount": 200,
  "method": "UPI",
  "referenceNo": "UPI_LEDGER_TEST_001",
  "note": "Partial payment ledger test"
}
```

Expected and verified:

- Payment created
- Invoice `paidAmount = 200`
- Invoice `balanceAmount = 399`
- Invoice `paymentStatus = PARTIALLY_PAID`
- Customer `outstandingAmount = 399`
- Test fails if customer `outstandingAmount` is not exactly `399`
- Ledger entry:
  - `type = PAYMENT`
  - `debit = 0`
  - `credit = 200`
  - `billNo = invoice.invoiceCode`
  - `invoiceId = invoice.id`
  - `paymentId = payment.id`
  - `status = COMPLETE`
  - `balanceAfter = 399`
- Test fails if this `CustomerTransaction` row is missing or any field above is wrong

### Final Payment

Route:

```text
POST /api/payments
```

Body:

```json
{
  "invoiceId": "INVOICE_ID",
  "amount": 399,
  "method": "CASH",
  "note": "Final payment ledger test"
}
```

Expected and verified:

- Payment created
- Invoice `paidAmount = 599`
- Invoice `balanceAmount = 0`
- Invoice `paymentStatus = PAID`
- Customer `outstandingAmount = 0`
- Test fails if customer `outstandingAmount` is not exactly `0`
- Ledger entry:
  - `type = PAYMENT`
  - `debit = 0`
  - `credit = 399`
  - `billNo = invoice.invoiceCode`
  - `invoiceId = invoice.id`
  - `paymentId = final payment id`
  - `status = COMPLETE`
  - `balanceAfter = 0`
- Test fails if this `CustomerTransaction` row is missing or any field above is wrong

### Customer Transactions

Route:

```text
GET /api/customers/:customerId/transactions
```

Expected and verified chronological order:

1. `INVOICE`, debit `599`, credit `0`, balanceAfter `599`
2. `PAYMENT`, debit `0`, credit `200`, balanceAfter `399`
3. `PAYMENT`, debit `0`, credit `399`, balanceAfter `0`

### Overpayment

Route:

```text
POST /api/payments
```

Body:

```json
{
  "invoiceId": "INVOICE_ID",
  "amount": 1,
  "method": "CASH"
}
```

Expected and verified:

- Request failed with `400`
- Invoice remained `PAID`
- Invoice `balanceAmount = 0`
- Customer `outstandingAmount = 0`
- No extra `CustomerTransaction` was created

### Tenant Isolation

Salon B data was created with its own customer/staff/service/appointment.

Verified:

- Salon A admin cannot generate invoice from Salon B appointment.
- Salon A admin cannot create payment against Salon B invoice.

Expected and verified responses:

- Cross-tenant invoice attempt: `404`
- Cross-tenant payment attempt: `404`

## Failure Found

### Route

```text
GET /api/customers/:customerId/transactions
```

### Problem

The route returned transactions newest-first, but the required ledger flow expects chronological order:

```text
INVOICE -> PAYMENT -> PAYMENT
```

The focused test received an invoice entry where the second entry should have been the partial payment entry.

### Root Cause

`CustomerModel.findTransactions` used:

```ts
orderBy: {
  createdAt: "desc",
}
```

### Minimal Fix

Changed transaction ordering to chronological:

```ts
orderBy: {
  createdAt: "asc",
}
```

## Final Results

```text
npm test
Test Suites: 5 passed, 5 total
Tests:       7 passed, 7 total
```

```text
npx tsc --noEmit
Passed with no errors
```

```text
npm run build
> backend@1.0.0 build
> tsc
```
