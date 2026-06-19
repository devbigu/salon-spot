# Salon Backend Postman Manual Testing Guide

Use this guide after starting the backend. Replace every placeholder such as
`SALON_ID` with values returned by earlier requests.

## Base Setup

Base URL:

```text
http://localhost:5000/api
```

Create these Postman environment variables:

```text
baseUrl = http://localhost:5000/api
superAdminToken =
salonAdminToken =
salonId =
branchId =
staffId =
customerId =
mainServiceId =
serviceId =
appointmentId =
invoiceId =
paymentId =
```

For protected routes, use:

```text
Authorization: Bearer {{superAdminToken}}
```

or:

```text
Authorization: Bearer {{salonAdminToken}}
```

Use this header for JSON requests:

```text
Content-Type: application/json
```

## 1. Health Check

```text
GET {{baseUrl}}/health
```

Expected status: `200`

## 2. SUPER_ADMIN Login

The only existing database user is:

```text
Email: superadmin@test.com
Password: superadmintest
Role: SUPER_ADMIN
```

Request:

```text
POST {{baseUrl}}/auth/login
```

```json
{
  "email": "superadmin@test.com",
  "password": "superadmintest"
}
```

Save:

```text
data.accessToken -> superAdminToken
data.user.id -> superAdminUserId
```

## 3. Check Current User

```text
GET {{baseUrl}}/auth/me
Authorization: Bearer {{superAdminToken}}
```

Expected role:

```text
SUPER_ADMIN
```

## 4. Create Salon

```text
POST {{baseUrl}}/salons
Authorization: Bearer {{superAdminToken}}
```

```json
{
  "name": "YOUR SALON NAME",
  "email": "salon@example.com",
  "phone": "9876543210",
  "addressLine1": "Street address",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001"
}
```

Required field:

```text
name
```

Save:

```text
data.id -> salonId
```

List salons:

```text
GET {{baseUrl}}/salons
Authorization: Bearer {{superAdminToken}}
```

## 5. Create Branch

```text
POST {{baseUrl}}/branches
Authorization: Bearer {{superAdminToken}}
```

```json
{
  "name": "Main Branch",
  "salonId": "{{salonId}}",
  "addressLine1": "Branch address",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "phone": "9876543210"
}
```

Required for SUPER_ADMIN:

```text
name
salonId
```

Save:

```text
data.id -> branchId
```

Branch routes:

```text
GET    {{baseUrl}}/branches
GET    {{baseUrl}}/branches/{{branchId}}
PUT    {{baseUrl}}/branches/{{branchId}}
DELETE {{baseUrl}}/branches/{{branchId}}
```

Branch update example:

```json
{
  "name": "Updated Branch",
  "phone": "9876500000"
}
```

Do not delete a branch after staff, customers, appointments, invoices, or
payments have been linked to it.

## 6. Create SALON_ADMIN

```text
POST {{baseUrl}}/users/salon-admin
Authorization: Bearer {{superAdminToken}}
```

```json
{
  "name": "Salon Admin Name",
  "email": "salonadmin@example.com",
  "phone_number": "9000000001",
  "password": "Password@123",
  "salonId": "{{salonId}}"
}
```

All fields are required.

## 7. SALON_ADMIN Login

```text
POST {{baseUrl}}/auth/login
```

```json
{
  "email": "salonadmin@example.com",
  "password": "Password@123"
}
```

Save:

```text
data.accessToken -> salonAdminToken
```

Verify the response user contains:

```text
role = SALON_ADMIN
salonId = your salonId
```

## 8. Create Staff

```text
POST {{baseUrl}}/staff
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "name": "Staff Name",
  "email": "staff@example.com",
  "phone": "9876543809",
  "jobRole": "Stylist",
  "workingFrom": "10:00",
  "workingTo": "19:00",
  "weekOff": "MONDAY",
  "joiningDate": "2026-06-03T10:00:00.000Z",
  "branchId": "{{branchId}}"
}
```

Required fields:

```text
name
email
phone
jobRole
workingFrom
workingTo
weekOff
```

Optional fields:

```text
joiningDate
branchId
reportingManagerId
```

If `joiningDate` is omitted, the current date/time is used.

Staff code format:

```text
SALON_INITIALS-MONTH-ISO_WEEKDAY-LAST_3_PHONE_DIGITS
```

Weekday numbers:

```text
Monday    = 1
Tuesday   = 2
Wednesday = 3
Thursday  = 4
Friday    = 5
Saturday  = 6
Sunday    = 7
```

Example:

```text
Salon: Sassy Salon
Joining date: Wednesday, June 3
Phone ending: 809
staffCode: SS-06-3-809
```

Save the UUID:

```text
data.id -> staffId
```

The UUID `id` is used in relations and API URLs. `staffCode` is the
human-readable staff identifier.

Duplicate `staffCode` in the same salon returns:

```text
409 Staff code already exists
```

Staff routes:

```text
GET    {{baseUrl}}/staff
GET    {{baseUrl}}/staff/{{staffId}}
PUT    {{baseUrl}}/staff/{{staffId}}
PATCH  {{baseUrl}}/staff/{{staffId}}/status
DELETE {{baseUrl}}/staff/{{staffId}}
```

Status body:

```json
{
  "status": false
}
```

Staff update example:

```json
{
  "name": "Updated Staff Name",
  "email": "updated-staff@example.com",
  "phone": "9876543809",
  "jobRole": "Senior Stylist",
  "workingFrom": "09:00",
  "workingTo": "18:00",
  "weekOff": "TUESDAY",
  "branchId": "{{branchId}}"
}
```

## 9. Create Customer

```text
POST {{baseUrl}}/customers
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "name": "Customer Name",
  "phone": "9876500001",
  "email": "customer@example.com",
  "gst": "27ABCDE1234F1Z5",
  "customNotes": "Customer preferences",
  "dateOfBirth": "1995-01-15T00:00:00.000Z",
  "anniversaryDate": "2020-05-10T00:00:00.000Z",
  "status": "REGULAR",
  "branchId": "{{branchId}}"
}
```

Required fields:

```text
name
phone
```

Customer status values:

```text
REGULAR
PREMIUM
IRREGULAR
```

Save:

```text
data.id -> customerId
```

Customer routes:

```text
GET    {{baseUrl}}/customers
GET    {{baseUrl}}/customers/{{customerId}}
PUT    {{baseUrl}}/customers/{{customerId}}
DELETE {{baseUrl}}/customers/{{customerId}}
GET    {{baseUrl}}/customers/{{customerId}}/transactions
POST   {{baseUrl}}/customers/{{customerId}}/wallet/add
```

Wallet body:

```json
{
  "amount": 500,
  "narration": "Wallet top-up"
}
```

## 10. Create Main Service

```text
POST {{baseUrl}}/main-services
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "name": "Hair",
  "status": true
}
```

Required:

```text
name
```

Save:

```text
data.id -> mainServiceId
```

Main service routes:

```text
GET    {{baseUrl}}/main-services
GET    {{baseUrl}}/main-services/{{mainServiceId}}
PUT    {{baseUrl}}/main-services/{{mainServiceId}}
PATCH  {{baseUrl}}/main-services/{{mainServiceId}}/status
DELETE {{baseUrl}}/main-services/{{mainServiceId}}
```

## 11. Create Service

```text
POST {{baseUrl}}/services
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "name": "Haircut",
  "description": "Standard haircut",
  "price": 599,
  "durationValue": 45,
  "durationUnit": "MINUTES",
  "branchId": "{{branchId}}",
  "mainServiceId": "{{mainServiceId}}"
}
```

Required:

```text
name
price
mainServiceId
```

Duration units:

```text
MINUTES
HOURS
```

Save:

```text
data.id -> serviceId
```

Service routes:

```text
GET    {{baseUrl}}/services
GET    {{baseUrl}}/services/{{serviceId}}
PUT    {{baseUrl}}/services/{{serviceId}}
PATCH  {{baseUrl}}/services/{{serviceId}}/status
DELETE {{baseUrl}}/services/{{serviceId}}
```

## 12. Create Appointment

```text
POST {{baseUrl}}/appointments
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "branchId": "{{branchId}}",
  "customerId": "{{customerId}}",
  "staffId": "{{staffId}}",
  "serviceIds": ["{{serviceId}}"],
  "startTime": "2026-07-01T10:00:00.000Z",
  "bookingNote": "Customer prefers morning slot",
  "internalNote": "Internal note"
}
```

Required:

```text
customerId
staffId
serviceIds
startTime
```

Save:

```text
data.id -> appointmentId
```

Verify:

```text
endTime is calculated from service duration
estimatedAmount is calculated from service prices
```

Conflict test: send another appointment for the same staff with overlapping
times. Expected status:

```text
409
```

An appointment starting exactly at the previous appointment's `endTime`
should be accepted.

Appointment routes:

```text
GET    {{baseUrl}}/appointments
GET    {{baseUrl}}/appointments/{{appointmentId}}
PUT    {{baseUrl}}/appointments/{{appointmentId}}
PATCH  {{baseUrl}}/appointments/{{appointmentId}}/reschedule
PATCH  {{baseUrl}}/appointments/{{appointmentId}}/status
GET    {{baseUrl}}/appointments/{{appointmentId}}/tracking
DELETE {{baseUrl}}/appointments/{{appointmentId}}
```

Reschedule body:

```json
{
  "startTime": "2026-07-01T12:00:00.000Z"
}
```

## 13. Appointment Status Flow

Run these in order:

```text
SCHEDULED -> CONFIRMED -> CHECKED_IN -> COMPLETED
```

Route:

```text
PATCH {{baseUrl}}/appointments/{{appointmentId}}/status
```

Confirmed:

```json
{
  "status": "CONFIRMED",
  "note": "Appointment confirmed"
}
```

Checked in:

```json
{
  "status": "CHECKED_IN",
  "note": "Customer arrived"
}
```

Completed:

```json
{
  "status": "COMPLETED",
  "note": "Service completed"
}
```

Other status values:

```text
CANCELLED
NO_SHOW
```

Tracking:

```text
GET {{baseUrl}}/appointments/{{appointmentId}}/tracking
```

Verify each entry contains:

```text
oldStatus
newStatus
note
changedById / changedBy
createdAt
```

## 14. Create Invoice

Appointment must be `COMPLETED`.

```text
POST {{baseUrl}}/invoices/from-appointment/{{appointmentId}}
Authorization: Bearer {{salonAdminToken}}
```

Bill of supply:

```json
{
  "invoiceType": "BILL_OF_SUPPLY",
  "discountAmount": 0,
  "processingFeeAmount": 0,
  "billingNote": "Thank you",
  "footerNote": "Visit again"
}
```

GST invoice:

```json
{
  "invoiceType": "GST_INVOICE",
  "discountAmount": 0,
  "processingFeeAmount": 0,
  "taxPercent": 18
}
```

Save:

```text
data.id -> invoiceId
```

Verify after invoice creation:

```text
paymentStatus = UNPAID
paidAmount = 0
balanceAmount = totalAmount
customer outstandingAmount increases
CustomerTransaction type = INVOICE
debit = invoice total
credit = 0
balanceAfter = customer outstandingAmount
```

Invoice routes:

```text
GET   {{baseUrl}}/invoices
GET   {{baseUrl}}/invoices/{{invoiceId}}
PATCH {{baseUrl}}/invoices/{{invoiceId}}/cancel
```

Creating a second invoice from the same appointment should fail.

## 15. Record Partial Payment

```text
POST {{baseUrl}}/payments
Authorization: Bearer {{salonAdminToken}}
```

```json
{
  "invoiceId": "{{invoiceId}}",
  "amount": 200,
  "method": "UPI",
  "referenceNo": "UPI_REFERENCE",
  "note": "Partial payment"
}
```

Payment methods accepted by this API:

```text
CASH
CARD
UPI
OTHER
```

Save:

```text
data.payment.id -> paymentId
```

Verify:

```text
invoice paidAmount increases
invoice balanceAmount decreases
paymentStatus = PARTIALLY_PAID
customer outstandingAmount decreases
CustomerTransaction type = PAYMENT
debit = 0
credit = payment amount
paymentId is populated
```

## 16. Record Final Payment

Use the exact remaining invoice balance:

```json
{
  "invoiceId": "{{invoiceId}}",
  "amount": 399,
  "method": "CASH",
  "note": "Final payment"
}
```

Verify:

```text
paymentStatus = PAID
balanceAmount = 0
customer outstandingAmount = 0
```

Overpayment must fail:

```json
{
  "invoiceId": "{{invoiceId}}",
  "amount": 1,
  "method": "CASH"
}
```

If the invoice is already paid, expected status is `400`.

Payment routes:

```text
GET {{baseUrl}}/payments
GET {{baseUrl}}/payments/{{paymentId}}
```

## 17. Customer Ledger Check

```text
GET {{baseUrl}}/customers/{{customerId}}/transactions
Authorization: Bearer {{salonAdminToken}}
```

Expected chronological flow:

```text
1. INVOICE debit
2. PAYMENT credit
3. PAYMENT credit
```

Check these fields:

```text
type
debit
credit
billNo
invoiceId
paymentId
balanceAfter
status
createdAt
```

Do not consider invoice/payment testing complete unless customer
`outstandingAmount` and the ledger transactions are correct.

## 18. Tenant Isolation Test

Create Salon B, Branch B, Staff B, Customer B, Main Service B, and Service B
using the SUPER_ADMIN token.

Then use the Salon A admin token and try to create an appointment with Salon B
IDs:

```json
{
  "branchId": "SALON_B_BRANCH_ID",
  "customerId": "SALON_B_CUSTOMER_ID",
  "staffId": "SALON_B_STAFF_ID",
  "serviceIds": ["SALON_B_SERVICE_ID"],
  "startTime": "2026-07-02T10:00:00.000Z"
}
```

Expected: request fails because the resources do not belong to Salon A.

Also test:

```text
Salon A admin cannot invoice Salon B appointment.
Salon A admin cannot pay Salon B invoice.
Salon A admin cannot fetch Salon B customer/staff/invoice/payment by ID.
```

## Suggested Manual Test Order

```text
1. Login SUPER_ADMIN
2. Create salon
3. Create branch
4. Create SALON_ADMIN
5. Login SALON_ADMIN
6. Create staff
7. Create customer
8. Create main service
9. Create service
10. Create appointment
11. Test conflict
12. Update appointment statuses
13. Check status tracking
14. Create invoice
15. Check customer outstanding and invoice ledger entry
16. Record partial payment
17. Check customer outstanding and payment ledger entry
18. Record final payment
19. Confirm zero balance
20. Test overpayment
21. Test tenant isolation
```
