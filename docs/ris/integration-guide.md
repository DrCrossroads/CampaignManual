# RIS Integration Guide

This guide provides comprehensive information for integrating the Novarad RIS system with other healthcare systems and workflows.

## Table of Contents

- [Integration Overview](#integration-overview)
- [HL7 Integration](#hl7-integration)
- [DICOM Integration](#dicom-integration)
- [EMR/EHR Integration](#emrehr-integration)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## Integration Overview

### Supported Standards

The Novarad RIS supports integration through:

- HL7 v2.x: Patient demographics, orders, results
- DICOM: Worklist management, study information
- RESTful APIs: Modern integration endpoints
- Database: Direct database integration options
- File Transfer: CSV/XML import/export capabilities

### Integration Architecture

The system provides multiple integration points:

- Message Broker: Central hub for all integrations
- Interface Engine: HL7 message processing
- API Gateway: RESTful service endpoints
- Database Views: Read-only access to key data
- File Monitoring: Automated file processing

## HL7 Integration

### Message Types

Supported HL7 message types:

#### ADT (Admission/Discharge/Transfer)

- A04: Register patient
- A08: Update patient information
- A11: Cancel admit patient
- A23: Delete patient record

#### ORM (Order Management)

- O01: Order message
- O02: Order status update
- O03: Order cancellation

#### ORU (Observation Result)

- R01: Unsolicited observation message
- R02: Query for results

#### SIU (Scheduling Information)

- S12: New appointment booking
- S13: Appointment rescheduling
- S15: Appointment cancellation

### HL7 Configuration

#### Connection Settings

```text
Protocol: TCP/IP
Port: 6661 (configurable)
Character Set: UTF-8
Field Separator: |
Component Separator: ^
Repetition Separator: ~
Escape Character: \
Sub-component Separator: &
```

#### Sample HL7 Messages

##### Patient Registration (ADT^A04)

```text
MSH|^~\&|HIS|HOSPITAL|RIS|NOVARAD|20240612140000||ADT^A04|12345|P|2.5
EVN|A04|20240612140000|||^ADMIN^SYSTEM
PID|1||123456789^^^MR^MR||DOE^JOHN^MIDDLE||19800101|M|||123 MAIN ST^^CITY^ST^12345^USA|||||||123456789
```

##### Order Message (ORM^O01)

```text
MSH|^~\&|HIS|HOSPITAL|RIS|NOVARAD|20240612140000||ORM^O01|67890|P|2.5
PID|1||123456789^^^MR^MR||DOE^JOHN^MIDDLE||19800101|M
ORC|NW|ORD001|ORD001|||E
OBR|1|ORD001|ORD001|36553^CT CHEST W/O CONTRAST^L|||20240612140000||||||||^DOCTOR^ORDERING^MD
```

### HL7 Troubleshooting

Common Issues:

- Connection Failures: Check network connectivity and port settings
- Message Parsing Errors: Validate HL7 message format
- Character Encoding: Ensure UTF-8 encoding
- Acknowledgment Issues: Verify ACK/NAK processing

## DICOM Integration

### DICOM Services

#### DICOM Worklist (MWL)

- Provides scheduled procedure information
- Maintains patient and study details
- Supports modality worklist queries

#### DICOM Storage

- Receives images from modalities
- Stores study information
- Manages image routing

### Worklist Configuration

#### Basic Settings

```text
AE Title: NOVARAD_RIS
Port: 104
Max Associations: 10
Supported Transfer Syntaxes:
- Implicit VR Little Endian
- Explicit VR Little Endian
- Explicit VR Big Endian
```

#### Worklist Query Support

Standard DICOM tags supported:

- (0008,0050) Accession Number
- (0010,0010) Patient Name
- (0010,0020) Patient ID
- (0010,0030) Patient Birth Date
- (0010,0040) Patient Sex
- (0020,000D) Study Instance UID
- (0040,0100) Scheduled Procedure Step Sequence

### DICOM Troubleshooting

Connectivity Issues:

- Verify AE Title configuration
- Check DICOM port accessibility
- Validate network settings

Worklist Problems:

- Confirm scheduled procedures exist
- Check date/time ranges
- Verify patient information

## EMR/EHR Integration

### Integration Methods

#### Direct Database Integration

- Real-time data synchronization
- Custom SQL views and procedures
- Optimized for performance

#### API Integration

- RESTful web services
- JSON/XML data formats
- Secure authentication

#### File-Based Integration

- Scheduled data exports/imports
- CSV/XML file formats
- Automated file processing

### Authentication Integration

#### Single Sign-On (SSO)

- SAML 2.0 support
- Active Directory integration
- Federated authentication

#### User Provisioning

- Automated user creation
- Role-based access control
- Group membership synchronization

## API Integration

### RESTful APIs

#### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "PLACEHOLDER_PASSWORD"
}
```

#### Patient Search

```http
GET /api/patients?name=DOE&birthdate=1980-01-01
Authorization: Bearer PLACEHOLDER_TOKEN
```

#### Order Creation

```json
POST /api/orders
Content-Type: application/json
Authorization: Bearer PLACEHOLDER_TOKEN

{
  "patientId": "123456",
  "procedureCode": "36553",
  "orderingPhysician": "Dr. Smith",
  "scheduledDate": "2024-06-15T10:00:00Z"
}
```

### SDK Support

Available SDKs:

- .NET Core
- Java
- Python
- JavaScript/Node.js

#### Code Examples

##### .NET Integration

```csharp
var client = new NovaradRisClient("api-key");
var patient = await client.Patients.GetByIdAsync("123456");
var orders = await client.Orders.GetByPatientAsync("123456");
```

##### Python Integration

```python
from novarad_ris import RisClient

client = RisClient(api_key="your-api-key")
patient = client.patients.get_by_id("123456")
orders = client.orders.get_by_patient("123456")
```

### Webhook Support

#### Event Notifications

- Patient registration
- Order creation/updates
- Study completion
- Report finalization

#### Webhook Configuration

```json
{
  "url": "https://your-system.com/webhooks/ris",
  "events": ["patient.created", "order.updated"],
  "secret": "PLACEHOLDER_WEBHOOK_SECRET"
}
```

## Troubleshooting

### Integration Monitoring

#### Log Files

- Integration service logs
- HL7 message logs
- API access logs
- Error logs

#### Monitoring Tools

- Real-time message tracking
- Integration status dashboard
- Performance metrics
- Alert notifications

### Common Issues

#### Message Processing Delays

- Check queue status
- Verify processing capacity
- Review error logs
- Monitor system resources

#### Data Synchronization Issues

- Validate message formats
- Check field mappings
- Verify data transformations
- Review timing issues

#### Authentication Problems

- Verify credentials
- Check token expiration
- Validate SSL certificates
- Review firewall settings

### Support Resources

#### Documentation

- Integration specifications
- API documentation
- Sample code repositories
- Testing guidelines

#### Support Contacts

- Integration team: [integration@novarad.com](mailto:integration@novarad.com)
- Technical support: [support@novarad.com](mailto:support@novarad.com)
- Training: [training@novarad.com](mailto:training@novarad.com)

---

*Last updated: June 2025*
*Document version: 1.0*
